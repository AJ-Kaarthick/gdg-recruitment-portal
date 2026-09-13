import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getDepartmentDisplayName } from '@/lib/departments';
import { VALID_STATUSES, RECRUITMENT_STATUS } from '@/lib/status';

export async function PATCH(req, { params }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const db = await connect();
        const { id } = params;
        const body = await req.json().catch(() => ({}));
        const { status, shortlisted } = body;

        let targetStatus = null;
        let nextShortlisted = false;

        if (typeof status === "string") {
            const normalized = status.toLowerCase().trim();
            if (!VALID_STATUSES.includes(normalized)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Invalid status payload: must be one of ${VALID_STATUSES.join(', ')}`,
                    },
                    { status: 400 }
                );
            }
            targetStatus = normalized;
            nextShortlisted = (targetStatus === RECRUITMENT_STATUS.SHORTLISTED);
        } else if (typeof shortlisted === "boolean") {
            // Backward compatibility for legacy clients passing boolean { shortlisted }
            nextShortlisted = shortlisted;
            targetStatus = shortlisted ? RECRUITMENT_STATUS.SHORTLISTED : RECRUITMENT_STATUS.PENDING;
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payload: must provide 'status' (pending, shortlisted, waitlisted, rejected) or 'shortlisted' (boolean)",
                },
                { status: 400 }
            );
        }

        const docRef = db.collection('formData').doc(id);

        let updatedData;

        try {
            await db.runTransaction(async (t) => {
                const snapshot = await t.get(docRef);

                if (!snapshot.exists) {
                    const notFoundError = new Error('APPLICANT_NOT_FOUND');
                    throw notFoundError;
                }

                const applicantData = snapshot.data();
                const studentEmail = applicantData?.Email;

                if (nextShortlisted) {
                    // Check if this student already has another department application shortlisted
                    if (studentEmail) {
                        const existingShortlistedQuery = db
                            .collection('formData')
                            .where('Email', '==', studentEmail)
                            .where('shortlisted', '==', true);
                        const existingShortlisted = await t.get(existingShortlistedQuery);

                        const conflictingDoc = existingShortlisted.docs.find((doc) => doc.id !== id);
                        if (conflictingDoc) {
                            const conflictingDept = conflictingDoc.data()?.Department;
                            const deptName = getDepartmentDisplayName(conflictingDept) || conflictingDept || "another department";
                            const conflictError = new Error('ALREADY_SHORTLISTED');
                            conflictError.conflictingDepartment = deptName;
                            throw conflictError;
                        }
                    }
                }

                t.update(docRef, {
                    status: targetStatus,
                    shortlisted: nextShortlisted,
                });

                updatedData = {
                    id: snapshot.id,
                    _id: snapshot.id,
                    ...serializeFirestoreData({
                        ...applicantData,
                        status: targetStatus,
                        shortlisted: nextShortlisted,
                    }),
                };
            });
        } catch (txError) {
            if (txError.message === 'APPLICANT_NOT_FOUND') {
                return NextResponse.json(
                    { success: false, message: 'Applicant not found' },
                    { status: 404 }
                );
            }
            if (txError.message === 'ALREADY_SHORTLISTED') {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Cannot shortlist: Student is already shortlisted for ${txError.conflictingDepartment}. A student can only be selected for one department.`,
                        conflictingDepartment: txError.conflictingDepartment,
                    },
                    { status: 409 }
                );
            }
            throw txError;
        }

        return NextResponse.json({ success: true, data: updatedData });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to update applicant' },
            { status: 500 }
        );
    }
}
