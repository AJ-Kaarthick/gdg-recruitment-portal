"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Loader2, FileText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function UserButton({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const res = await authClient.signOut();
      if (res?.error) {
        toast.error(res.error.message || "Failed to sign out. Please try again.");
        setIsSigningOut(false);
        return;
      }
      const sessionAtom = authClient.$store?.atoms?.session;
      if (sessionAtom) {
        sessionAtom.set({
          data: null,
          error: null,
          isPending: false,
          isRefetching: false,
          refetch: sessionAtom.get()?.refetch,
        });
      }
      toast.success("Signed out successfully");
      setIsOpen(false);
      setIsSigningOut(false);
      router.replace("/auth/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error?.message || error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={isSigningOut ? undefined : setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          disabled={isSigningOut}
          className="relative h-9 w-9 rounded-full p-0 disabled:opacity-70"
          aria-label="User account menu"
        >
          <Avatar className="h-9 w-9">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                getInitials(user.name?.split(" ")[0], user.name?.split(" ")[1])
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "Applicant"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/applications" className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>My Applications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer text-destructive focus:text-destructive disabled:pointer-events-none disabled:opacity-50"
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FaSignOutAlt className="mr-2 h-4 w-4" />
          )}
          <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 