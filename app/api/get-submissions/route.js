import { NextResponse } from "next/server";
import { connect, serializeFirestoreData } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Authorization is entirely session-derived: do not accept or trust any client-supplied email
    const userEmail = session.user.email;

    const db = await connect();
    const snapshot = await db.collection("formData").where("Email", "==", userEmail).get();
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data() || {};
      return {
        id: doc.id,
        Department: docData.Department,
        priority: docData.priority !== undefined ? docData.priority : null,
        shortlisted: Boolean(docData.shortlisted),
        createdAt: serializeFirestoreData(docData.createdAt),
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error checking applications:", error);
    return NextResponse.json(
      {
        message:
          "Internal server error inside check-applications dir",
      },
      { status: 500 }
    );
  }
}
