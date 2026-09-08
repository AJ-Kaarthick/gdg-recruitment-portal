"use client";

import React from "react";

const Footer = () => {
  const currentYearString = new Date().getFullYear().toString();
  const organizationLabel = "GDG Club · Recruitment Portal";

  return (
    <footer className="w-full border-t border-border/40 bg-background/50 py-8 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8">
        <p>© {currentYearString} {organizationLabel}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
