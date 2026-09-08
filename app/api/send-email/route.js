require("dotenv").config();
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuestionnaireData, reviews } from "@/constants";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME?.trim(),
        pass: process.env.EMAIL_PASSWORD?.replace(/\s+/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
});

const escapeHtml = (str) => {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const resolveDepartmentName = (deptInput) => {
    if (typeof deptInput !== "string" || !deptInput.trim()) {
        return "Department";
    }
    const trimmed = deptInput.trim();

    const reviewMatch = reviews.find(
        (r) => r.name === trimmed || r.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (reviewMatch) return reviewMatch.name;

    const qMatch = QuestionnaireData.find(
        (q) => q.department === trimmed || q.department.toLowerCase() === trimmed.toLowerCase()
    );
    if (qMatch) return qMatch.department;

    if (
        trimmed === "Web Development" ||
        trimmed === "App Development" ||
        trimmed === "Development"
    ) {
        return "Development Department";
    }
    if (trimmed === "Photography" || trimmed === "Video Editing") {
        return "Photography & Video Editing Department";
    }

    return trimmed;
};

export async function POST(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(
                JSON.stringify({ error: "Authentication required" }),
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return new Response(
                JSON.stringify({ error: "Forbidden: Admin access required" }),
                { status: 403 }
            );
        }

        const { recipients, payloadData } = await req.json().catch(() => ({}));

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return new Response(
                JSON.stringify({ error: "No recipients provided" }),
                { status: 400 }
            );
        }

        const results = await Promise.allSettled(
            recipients.map(async (recipient) => {
                if (!recipient || !recipient.Email) {
                    return { status: "skipped", reason: "Missing email" };
                }

                const rawName = recipient.Name || "Applicant";
                const rawDept = resolveDepartmentName(recipient.Department);

                const safeName = escapeHtml(rawName);
                const safeDept = escapeHtml(rawDept);

                let generalTemp = `
                <div>
                    ${payloadData?.body || ""}
                </div>
                `;

                generalTemp = generalTemp.replace(/#name/g, safeName);
                generalTemp = generalTemp.replace(/#dept/g, safeDept);

                const mailOptions = {
                    from: `"Recruitment Portal" <${process.env.EMAIL_USERNAME?.trim()}>`,
                    to: recipient.Email.trim(),
                    subject: payloadData?.subject || "Application Update",
                    html: generalTemp,
                };

                await transporter.sendMail(mailOptions);
                return { status: "sent", email: recipient.Email };
            })
        );

        const sentCount = results.filter(
            (r) => r.status === "fulfilled" && r.value?.status === "sent"
        ).length;
        const skippedCount = results.filter(
            (r) => r.status === "fulfilled" && r.value?.status === "skipped"
        ).length;
        const failedCount = results.filter((r) => r.status === "rejected").length;

        return new Response(
            JSON.stringify({
                message: "Email processing complete",
                sentCount,
                failedCount,
                skippedCount,
                total: recipients.length,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Failed to send emails" }),
            { status: 500 }
        );
    }
}
