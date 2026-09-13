import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";
import { QuestionnaireData, reviews, UNIVERSAL_QUESTION_ID } from "@/constants";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const escapeHtml = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const getCanonicalDepartment = (deptInput) => {
  if (typeof deptInput !== "string") return null;
  const trimmed = deptInput.trim();
  if (!trimmed) return null;

  // 1. Exact match in QuestionnaireData
  const exactMatch = QuestionnaireData.find(
    (q) => q.department === trimmed
  );
  if (exactMatch) return exactMatch.department;

  // 2. Normalized match in QuestionnaireData
  const normalizedInput = trimmed.toLowerCase().replace(/\s*\/\s*/g, "/");
  const normalizedMatch = QuestionnaireData.find(
    (q) => q.department.toLowerCase().replace(/\s*\/\s*/g, "/") === normalizedInput
  );
  if (normalizedMatch) return normalizedMatch.department;

  // 3. Match in reviews array
  const reviewMatch = reviews.find(
    (r) => r.name === trimmed || r.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (reviewMatch) return reviewMatch.name;

  return null;
};

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const deadline = new Date("2026-12-31T23:59:59+05:30");
    if (new Date() > deadline) {
      return new Response(
        JSON.stringify({
          message: "The submission deadline has passed",
        }),
        { status: 403 }
      );
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return new Response(
        JSON.stringify({ message: "Invalid payload format" }),
        { status: 400 }
      );
    }

    const { Department, Questions, Name, RegistrationNumber, Phone, Gender, priority, ...extraFields } = data;

    const canonicalDept = getCanonicalDepartment(Department);
    if (!canonicalDept) {
      return new Response(
        JSON.stringify({ message: "Invalid or unrecognized department" }),
        { status: 400 }
      );
    }

    const trimmedName = typeof Name === "string" ? Name.trim() : "";
    const nameRegex = /^[\p{L}\s'’.-]+$/u;
    const letterCount = (trimmedName.match(/\p{L}/gu) || []).length;
    if (
      !trimmedName ||
      trimmedName.length < 2 ||
      trimmedName.length > 100 ||
      !nameRegex.test(trimmedName) ||
      letterCount < 2
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Please enter a valid full name (letters, spaces, apostrophes, hyphens, and periods only; minimum 2 characters; no numbers)",
        }),
        { status: 400 }
      );
    }

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    const trimmedRegNo = typeof RegistrationNumber === "string" ? RegistrationNumber.trim().toUpperCase() : "";
    if (!trimmedRegNo || !regNoRegex.test(trimmedRegNo)) {
      return new Response(
        JSON.stringify({
          message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
        }),
        { status: 400 }
      );
    }

    const ALLOWED_GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
    const trimmedGender = typeof Gender === "string" ? Gender.trim() : "";
    if (!trimmedGender || !ALLOWED_GENDERS.includes(trimmedGender)) {
      return new Response(
        JSON.stringify({
          message: "A valid gender selection is required",
        }),
        { status: 400 }
      );
    }

    const phoneRegex = /^[0-9]{10}$/;
    const trimmedPhone = typeof Phone === "string" ? Phone.trim() : "";
    if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) {
      return new Response(
        JSON.stringify({
          message: "Phone number must be exactly 10 digits (digits 0-9 only)",
        }),
        { status: 400 }
      );
    }

    if (!Questions || typeof Questions !== "object" || Array.isArray(Questions)) {
      return new Response(
        JSON.stringify({ message: "Questions answers must be a valid object" }),
        { status: 400 }
      );
    }

    const deptObj = QuestionnaireData.find((q) => q.department === canonicalDept);
    if (!deptObj) {
      return new Response(
        JSON.stringify({ message: "Invalid or unrecognized department" }),
        { status: 400 }
      );
    }

    const requiredQuestionIds = [
      UNIVERSAL_QUESTION_ID,
      ...deptObj.questions.filter((q) => !q.optional).map((q) => q.id),
    ];

    for (const qId of requiredQuestionIds) {
      const rawAnswer =
        Questions[qId] ??
        (qId === UNIVERSAL_QUESTION_ID
          ? Questions["Why do you want to join Organization Name?"] ||
            Questions["Why do you want to join DWASFW?"]
          : undefined);

      if (typeof rawAnswer !== "string" || !rawAnswer.trim()) {
        return new Response(
          JSON.stringify({ message: "All required application questions must be answered" }),
          { status: 400 }
        );
      }
    }

    for (const [qKey, qVal] of Object.entries(Questions)) {
      if (typeof qVal === "string") {
        const trimmed = qVal.trim();
        if (trimmed.length > 5000) {
          return new Response(
            JSON.stringify({ message: "Question answer exceeds maximum allowed length of 5000 characters" }),
            { status: 400 }
          );
        }
      }
    }

    const sanitizedQuestions = {};

    // 1. Process universal question
    const rawUniversal =
      Questions[UNIVERSAL_QUESTION_ID] ??
      Questions["Why do you want to join Organization Name?"] ??
      Questions["Why do you want to join DWASFW?"];
    if (typeof rawUniversal === "string") {
      sanitizedQuestions[UNIVERSAL_QUESTION_ID] = rawUniversal.trim();
    }

    // 2. Process legitimate department-specific questions (rejecting arbitrary keys)
    for (const q of deptObj.questions) {
      const rawVal = Questions[q.id];
      if (rawVal === undefined || rawVal === null) {
        continue;
      }
      if (typeof rawVal !== "string") {
        return new Response(
          JSON.stringify({ message: "Invalid question answer format" }),
          { status: 400 }
        );
      }
      sanitizedQuestions[q.id] = rawVal.trim();
    }

    const db = await connect();
    const collection = db.collection("formData");

    const deterministicId = `sub_${crypto
      .createHash("sha256")
      .update(`${userEmail}:${canonicalDept}`)
      .digest("hex")}`;
    const docRef = collection.doc(deterministicId);

    try {
      await db.runTransaction(async (t) => {
        const existingQuery = collection.where("Email", "==", userEmail);
        const existingSubmissions = await t.get(existingQuery);

        const exactDoc = await t.get(docRef);
        if (exactDoc.exists) {
          throw new Error("ALREADY_SUBMITTED_DEPT");
        }

        const alreadySubmittedDept = existingSubmissions.docs.some((doc) => {
          const docDept = doc.data()?.Department;
          return docDept && getCanonicalDepartment(docDept) === canonicalDept;
        });

        if (alreadySubmittedDept) {
          throw new Error("ALREADY_SUBMITTED_DEPT");
        }

        if (existingSubmissions.size >= 2) {
          throw new Error("MAX_DEPARTMENTS");
        }

        let assignedPriority = null;
        if (priority === 1 || priority === 2 || priority === "1" || priority === "2") {
          assignedPriority = Number(priority);
        }

        // Check priorities among existing submissions for this user
        const existingPriorities = existingSubmissions.docs
          .map((doc) => doc.data()?.priority)
          .filter((p) => p === 1 || p === 2);

        if (assignedPriority) {
          // If the requested priority is already taken by the user's other application, use the other slot
          if (existingPriorities.includes(assignedPriority)) {
            assignedPriority = assignedPriority === 1 ? 2 : 1;
          }
        } else {
          // If no priority specified, default based on existing submissions count
          if (existingPriorities.includes(1)) {
            assignedPriority = 2;
          } else if (existingPriorities.includes(2)) {
            assignedPriority = 1;
          } else {
            assignedPriority = existingSubmissions.size === 0 ? 1 : 2;
          }
        }

        t.set(docRef, {
          Name: trimmedName,
          RegistrationNumber: trimmedRegNo,
          Phone: trimmedPhone,
          Gender: trimmedGender,
          "Year of Study": typeof extraFields["Year of Study"] === "string" ? extraFields["Year of Study"].trim() : "",
          Department: canonicalDept,
          priority: assignedPriority,
          Questions: sanitizedQuestions,
          Email: userEmail,
          shortlisted: false,
          status: "pending",
          createdAt: new Date(),
        });
      });
    } catch (e) {
      if (e.message === "ALREADY_SUBMITTED_DEPT") {
        return new Response(
          JSON.stringify({
            message: `You have already submitted an application for ${canonicalDept}`,
          }),
          { status: 400 }
        );
      }
      if (e.message === "MAX_DEPARTMENTS") {
        return new Response(
          JSON.stringify({
            message: "Remember that you can only submit upto 2 unique applications",
          }),
          { status: 400 }
        );
      }
      throw e;
    }

    // Post-transaction best-effort confirmation email notification (non-blocking, failure-isolated)
    if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
      try {
        const safeCandidateName = escapeHtml(trimmedName);
        const safeDeptName = escapeHtml(canonicalDept);

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

        const sendMailPromise = transporter.sendMail({
          from: `"Recruitment Portal" <${process.env.EMAIL_USERNAME?.trim()}>`,
          to: userEmail.trim(),
          subject: `Application Submitted - ${safeDeptName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Application Submitted</h2>
              <p>Hello ${safeCandidateName},</p>
              <p>Your GDG Club application for <strong>${safeDeptName}</strong> has been successfully submitted.</p>
              <p>Thank you for applying to Recruitment 2026. Our team will review your application and provide updates accordingly.</p>
            </div>
          `,
        });

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error("Confirmation email dispatch timed out")),
            4000
          );
        });

        try {
          await Promise.race([sendMailPromise, timeoutPromise]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      } catch (emailErr) {
        // Best-effort: failures are non-fatal warnings and never alter or fail the successful HTTP 200 submission
        console.warn("Non-fatal: Application confirmation email failed to send:", emailErr?.message || emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Form submitted successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "Error submitting form" }), {
      status: 500,
    });
  }
}
