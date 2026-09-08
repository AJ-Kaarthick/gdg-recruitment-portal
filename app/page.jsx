"use client";
import React, { useState, useEffect } from "react";

// Component imports
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Departments from "@/components/Departments";
import Footer from "@/components/Footer";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("recruitment-home-notice-dismissed");
      if (!isDismissed) {
        setIsDialogOpen(true);
      }
    } catch {
      setIsDialogOpen(true);
    }
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    try {
      sessionStorage.setItem("recruitment-home-notice-dismissed", "true");
    } catch {
      // ignore storage write errors
    }
  };

  const popupConfig = {
    header: "Recruitment Notice",
    description: "Welcome to the recruitment portal.",
    message: [
      "Sign in with your email address to begin your application.",
      "You can apply to up to two departments.",
    ],
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      {!isPending && !user && (
        <PopupComp
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          PopupData={popupConfig}
        />
      )}

      <main className="flex-1 flex flex-col justify-center">
        <Hero />
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4 mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explore Departments
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover teams and find the right fit for your skills
            </p>
          </div>
          <Departments />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
