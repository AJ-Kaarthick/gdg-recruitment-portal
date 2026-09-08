"use client";

import React from "react";
import { useRouter, notFound } from "next/navigation";
import { reviews } from "@/constants/index";
import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const JoinDepartmentPage = ({ params }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const ids = params?.joinIds || [];
  const uniqueIds = new Set(ids);
  const valid =
    ids.length >= 1 &&
    ids.length <= 2 &&
    uniqueIds.size === ids.length &&
    ids.every((id) => reviews.some((dept) => dept.id === id));

  if (!valid) {
    notFound();
  }

  const departments = ids
    .map((id) => reviews.find((dept) => dept.id === id))
    .filter(Boolean);
  const isSignedIn = Boolean(session?.user);

  if (isPending) {
    return (
      <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
        <NavBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <NavBar />
      <div className="flex-1">
        {isSignedIn ? (
          <FormComp
            dept1={departments[0]}
            dept2={departments[1]}
          />
        ) : (
          <div className="flex justify-center items-center min-h-[60vh] m-10">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground mb-4">
                Sign In Required
              </p>
              <p className="text-base text-muted-foreground mb-6">
                Please sign in to access the application form.
              </p>
              <Button
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;
