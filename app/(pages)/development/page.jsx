"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { reviews } from "@/constants";
import { getDepartmentDisplayName, getDepartmentDescription } from "@/lib/departments";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    name: "∑_ApZ3V_gh",
    description:
      "k*N$5c fu900Q 7k3 C20Z!g 1kL1d3er & nUKpZg %AU0₹g!ir3C.",
    href: "/join/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    cta: "J01n_§x",
  },
  {
    name: "µ_Wb₹5D_lp",
    description:
      "bp05Lb(bTI, CZWSr₹#^Z *7J ^T( f391xQ 1kp #q₹X 3z!Kux 6j(IkL.",
    href: "/join/8143de1d-db17-42fa-958d-13b10804f894",
    cta: "J01n_§x",
  },
];

const DevelopmentPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 w-full">
        <header className="mb-8 sm:mb-10">
          <Link
            href="/departments"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" />
            Back to all departments
          </Link>

          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              Department Hub
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Development Departments
            </h1>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Creating and maintaining applications, involving frontend, backend, and database management. Select a track below to begin your application.
            </p>
          </div>
        </header>

        <section aria-label="Development tracks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const displayName = getDepartmentDisplayName(feature.name);
              const description = getDepartmentDescription(feature.description, feature.name);
              const ctaText = feature.cta === "J01n_§x" ? "Join Department" : feature.cta;
              const deptId = feature.href.replace("/join/", "");
              const deptReview = reviews.find((r) => r.id === deptId || r.name === feature.name);
              const Icon = deptReview?.icon;
              const tone = deptReview?.tone;
              const isAppDev = displayName.toLowerCase().includes("app");

              return (
                <Card
                  key={feature.name}
                  className="flex flex-col justify-between border border-border bg-card shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200 motion-reduce:transition-none"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      {Icon ? (
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: tone ? `${tone}20` : "rgba(255,255,255,0.1)" }}
                          aria-hidden="true"
                        >
                          <Icon size={24} style={{ color: tone || "#8ab4f8" }} />
                        </div>
                      ) : null}
                      <Badge variant="secondary" className="text-xs font-medium">
                        {isAppDev ? "Mobile Track" : "Web Track"}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-card-foreground">
                        {displayName}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button asChild className="w-full font-medium group">
                      <Link href={feature.href}>
                        {ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DevelopmentPage;
