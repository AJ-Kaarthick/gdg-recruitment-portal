import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { firestoreAdapter } from "better-auth-firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { validatePassword } from "@/lib/password-policy";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
const firestore = getFirestore(app);

const getBetterAuthBaseURL = () => {
  let url = process.env.BETTER_AUTH_URL?.trim();
  if (!url && process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL.trim()}`;
  }
  if (!url && process.env.NEXT_PUBLIC_APP_URL) {
    url = process.env.NEXT_PUBLIC_APP_URL.trim();
  }
  if (!url) {
    url = "http://localhost:3000";
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, "");
};

export const auth = betterAuth({
  baseURL: getBetterAuthBaseURL(),
  database: firestoreAdapter({
    firestore,
  }),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Strip any role escalation attempts across all auth endpoints
      if (ctx.body && typeof ctx.body === "object") {
        delete ctx.body.role;
        delete ctx.body.admin;
        delete ctx.body.roles;
        delete ctx.body.isAdmin;
        if (ctx.body.additionalData && typeof ctx.body.additionalData === "object") {
          delete ctx.body.additionalData.role;
          delete ctx.body.additionalData.admin;
          delete ctx.body.additionalData.roles;
          delete ctx.body.additionalData.isAdmin;
        }
      }

      if (ctx.path === "/sign-up/email" && ctx.body) {
        const body = ctx.body;
        const password = typeof body.password === "string" ? body.password : "";
        const confirmPassword = body.confirmPassword ?? body.confirm_password;

        // Ensure strict ephemerality and non-persistence:
        // Strip confirmPassword before persistence or session processing
        delete body.confirmPassword;
        delete body.confirm_password;

        if (confirmPassword !== undefined && confirmPassword !== password) {
          throw new APIError("BAD_REQUEST", {
            code: "PASSWORDS_DO_NOT_MATCH",
            message: "Passwords do not match.",
          });
        }

        const { isValid, error } = validatePassword(password);
        if (!isValid) {
          throw new APIError("BAD_REQUEST", {
            code: "PASSWORD_TOO_WEAK",
            message: error || "Password does not meet security requirements.",
          });
        }
      }
    }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reduces re-login and session creation writes)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    updateAge: 60 * 60 * 24, // 1 day (prevent frequent session writes)
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      // If an existing applicant is unverified, re-dispatch the verification email
      // so repeated signup attempts fulfill delivery without leaking enumeration
      if (!user.emailVerified && user.email) {
        try {
          await auth.api.sendVerificationEmail({
            body: { email: user.email, callbackURL: "/auth/verify?verified=true" },
          });
        } catch (err) {
          console.error(
            `[Auth Email] Re-dispatch on existing unverified user sign-up failed: ${err?.name || "Error"} (${err?.code || err?.message || "Unknown error"})`
          );
        }
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const rawUser = process.env.EMAIL_USERNAME || "";
      const rawPass = process.env.EMAIL_PASSWORD || "";
      const smtpUser = rawUser.trim();
      // Google App Passwords generated with spaces (e.g. 'xxxx xxxx xxxx xxxx') must have spaces stripped
      const smtpPass = rawPass.replace(/\s+/g, "");

      if (!smtpUser || !smtpPass) {
        console.error(
          `[Auth Email] Verification delivery failed: SMTP credentials missing (EMAIL_USERNAME configured: ${Boolean(smtpUser)}, EMAIL_PASSWORD configured: ${Boolean(smtpPass)}).`
        );
        throw new Error("Email verification delivery failed: SMTP credentials are not configured.");
      }

      const recipientDomain = typeof user.email === "string" && user.email.includes("@")
        ? user.email.split("@")[1]
        : "unknown";
      console.log(`[Auth Email] Dispatching verification email to domain: @${recipientDomain}`);

      const startTime = Date.now();
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        });

        const safeName = typeof user.name === "string"
          ? user.name
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;")
          : "Candidate";

        // Ensure verification link redirects user to dedicated verification page
        let verificationUrl = url;
        try {
          const parsedUrl = new URL(url);
          parsedUrl.searchParams.set("callbackURL", "/auth/verify?verified=true");
          verificationUrl = parsedUrl.toString();
        } catch {
          // Fallback to url if parsing fails
        }

        await transporter.sendMail({
          from: `"Recruitment Portal" <${smtpUser}>`,
          to: user.email.trim(),
          subject: "Verify your email address - Recruitment 2026",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Email Verification</h2>
              <p>Hello ${safeName},</p>
              <p>Please verify your email address to complete your registration by clicking the button below:</p>
              <div style="margin: 24px 0;">
                <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
            </div>
          `,
        });
        console.log(`[Auth Email] Verification email successfully sent to SMTP for @${recipientDomain} in ${Date.now() - startTime}ms`);
      } catch (err) {
        console.error(
          `[Auth Email] Failed to send verification email to @${recipientDomain}: ${err?.name || "Error"} (${err?.code || err?.message || "Unknown error"})`
        );
        throw new Error("Failed to send verification email.");
      }
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(), // This must be the last plugin in the array
  ],
});