"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { MdAdminPanelSettings } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import CountdownTimer from "./common/CountdownTimer";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const userSessionEmail = session?.user?.email || "";
  const isAuthenticated = Boolean(userSessionEmail);
  const hasAdminPermissions = session?.user?.role === "admin";

  const navigationRouteList = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Departments", href: "/departments" },
    ...(isAuthenticated
      ? [{ label: "My Applications", href: "/applications" }]
      : []),
    ...(isAuthenticated && hasAdminPermissions
      ? [{ label: "Admin Panel", href: "/admin" }]
      : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md shadow-sm"
          : "border-b border-border/30 bg-background/50 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <Image
              src="/assets/gdg.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="font-bold text-base tracking-tight sm:text-lg text-foreground">
              Recruitment Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {navigationRouteList.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href={item.href} className="flex items-center">
                {item.label === "Admin Panel" && (
                  <MdAdminPanelSettings className="mr-1.5 h-4 w-4" />
                )}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CountdownTimer className="hidden md:flex" />
          <ThemeToggle />
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : !isAuthenticated ? (
            <Button size="sm" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          ) : (
            <UserButton user={session?.user} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
