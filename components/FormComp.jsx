import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import {
  QuestionnaireData,
  UNIVERSAL_QUESTION,
  UNIVERSAL_QUESTION_ID,
  resolveQuestionLabel,
} from "@/constants";
import { getDepartmentDisplayName } from "@/lib/departments";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSubmissions } from "@/components/SubmissionsProvider";

const normaliseQuestion = (question) => (
  typeof question === "string"
    ? { id: question, name: question, type: "generic", placeholder: "2-3 sentences" }
    : question
);

const isObfuscatedText = (str) => {
  if (!str || typeof str !== "string") return false;
  if (/[₹*^%$#@!~∂≤≈πΩ§∆Δøµ∑∫]/.test(str)) return true;
  const words = str.trim().split(/\s+/);
  const mixedWordCount = words.filter((w) => /[a-zA-Z]/.test(w) && /\d/.test(w)).length;
  if (mixedWordCount >= 2 || (words.length <= 4 && mixedWordCount >= 1)) return true;
  return false;
};

const sanitizePlaceholder = (placeholder, isCompact) => {
  if (!placeholder || typeof placeholder !== "string" || isObfuscatedText(placeholder)) {
    return isCompact ? "Your answer or link..." : "Please provide your response in 2-3 sentences...";
  }
  return placeholder;
};

const FormComp = ({ dept1, dept2, isLoading, setIsLoading }) => {
  // Use Better Auth's useSession hook directly
  const { data: session, isPending, error } = authClient.useSession();
  
  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  // Form lifecycle state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } = useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const initialDepartmentNames = useMemo(
    () => [dept1, dept2].filter(Boolean).map((department) => typeof department === "string" ? department : department.name),
    [dept1, dept2]
  );
  const [orderedDeptNames, setOrderedDeptNames] = useState(initialDepartmentNames);

  useEffect(() => {
    setOrderedDeptNames(initialDepartmentNames);
  }, [initialDepartmentNames]);

  const departmentNames = orderedDeptNames;

  const getDepartmentPriority = (department) => {
    if (submittedDepartments.length >= 1) {
      return 2;
    }
    if (orderedDeptNames.length === 2) {
      return orderedDeptNames[0] === department ? 1 : 2;
    }
    return 1;
  };

  const swapFormPriorities = () => {
    if (orderedDeptNames.length === 2) {
      setOrderedDeptNames([orderedDeptNames[1], orderedDeptNames[0]]);
    }
  };

  const draftKey = user?.email && orderedDeptNames.length
    ? `recruitment-draft:${user.email}:${[...orderedDeptNames].sort().join("|")}`
    : null;

  // Sync application limit check from contextSubmitted
  useEffect(() => {
    if (contextSubmitted && contextSubmitted.length >= 2) {
      setErrorMessage(
        "Remember that you can only submit upto 2 unique applications"
      );
    }
  }, [contextSubmitted]);

  const normalizeDeptName = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");

  const departmentQuestions = useMemo(
    () => departmentNames.flatMap((department) =>
      (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion)
    ),
    [departmentNames]
  );

  const schemaObj = {
    Name: z
      .string({ required_error: "Full Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .refine((val) => /^[\p{L}\s'’.-]+$/u.test(val), {
        message: "Name can only contain letters, spaces, apostrophes, hyphens, and periods (no numbers)",
      })
      .refine((val) => (val.match(/\p{L}/gu) || []).length >= 2, {
        message: "Name must contain at least 2 letters",
      }),
    RegistrationNumber: z
      .string({ required_error: "Registration number is required" })
      .trim()
      .transform((val) => val.toUpperCase())
      .pipe(
        z.string().regex(
          /^\d{2}[A-Z]{3}\d{4}$/,
          "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
        )
      ),
    Gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
    Email: z.string(),
    Phone: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits (digits 0-9 only)"),
    "Year of Study": z.string().optional(),
    [UNIVERSAL_QUESTION_ID]: z
      .string({ required_error: "This question is required" })
      .trim()
      .min(1, "Please answer this question")
      .max(5000, "Answer cannot exceed 5000 characters"),
  };

  departmentQuestions.forEach((q) => {
    if (q?.id) {
      if (q.optional) {
        schemaObj[q.id] = z
          .string()
          .max(5000, "Answer cannot exceed 5000 characters")
          .optional()
          .or(z.literal(""));
      } else {
        schemaObj[q.id] = z
          .string({ required_error: "This question is required" })
          .trim()
          .min(1, "Please answer this question")
          .max(5000, "Answer cannot exceed 5000 characters");
      }
    }
  });

  const formSchema = z.object(schemaObj);
  const initialDefaultValues = {
    Name: "",
    RegistrationNumber: "",
    Gender: "",
    Email: "",
    Phone: "",
    [UNIVERSAL_QUESTION_ID]: "",
  };
  departmentQuestions.forEach((q) => {
    if (q?.id) {
      initialDefaultValues[q.id] = "";
    }
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialDefaultValues,
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      const universalDraftValue =
        savedDraft.values?.[UNIVERSAL_QUESTION_ID] ??
        savedDraft.values?.["Why do you want to join Organization Name?"] ??
        savedDraft.values?.["Why do you want to join DWASFW?"] ??
        "";
      form.reset({
        ...form.getValues(),
        ...savedDraft.values,
        Email: email,
        Gender: savedDraft.values?.Gender || "",
        [UNIVERSAL_QUESTION_ID]: universalDraftValue,
      });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        }
      }

      if (!isActive) return;
      const completed = [...new Set([...(savedDraft.submittedDepartments || []), ...remoteSubmitted])];
      setSubmittedDepartments(completed);
      if (departmentNames.length > 0 && departmentNames.every((dept) => completed.includes(dept))) {
        setErrorMessage(`You have already submitted an application for ${departmentNames.map(getDepartmentDisplayName).join(" and ")}.`);
      }
      localStorage.setItem(draftKey, JSON.stringify({ values: form.getValues(), submittedDepartments: completed }));
      setLoading(false);
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) {
        setLoading(false);
        setIsDraftReady(true);
      }
    });

    return () => { isActive = false; };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    const timeoutId = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify({ values: watchedValues, submittedDepartments }));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  // Check if user is authenticated
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <Card className="max-w-md w-full border-border bg-card p-6 text-center space-y-4 shadow-sm">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Sign In Required
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Please sign in to access the application form.
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/auth/signin")} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // User is authenticated
  const userEmail = user?.email;

  const handleSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter((department) => !submittedDepartments.includes(department));

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/");
      return;
    }

    const basicDetails = {
      Name: (values.Name || "").trim(),
      RegistrationNumber: (values.RegistrationNumber || "").trim().toUpperCase(),
      Gender: (values.Gender || "").trim(),
      Email: (values.Email || "").trim(),
      Phone: (values.Phone || "").trim(),
      "Year of Study": typeof values["Year of Study"] === "string" ? values["Year of Study"].trim() : "",
    };

    const submitDepartment = async (department) => {
      const questions = (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion);

      const universalAnswer = (
        values[UNIVERSAL_QUESTION_ID] ||
        values["Why do you want to join Organization Name?"] ||
        values["Why do you want to join DWASFW?"] ||
        ""
      ).trim();

      const questionsPayload = {
        [UNIVERSAL_QUESTION_ID]: universalAnswer,
        ...questions.reduce(
          (answers, question) => ({
            ...answers,
            [question.id]: (values[question.id] || "").trim(),
          }),
          {}
        ),
      };

      const currentPriority = getDepartmentPriority(department);
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          priority: currentPriority,
          Questions: questionsPayload,
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(pendingDepartments.map(submitDepartment));
      const successful = results
        .filter((result) => result.status === "fulfilled" && result.value.success)
        .map((result) => result.value.department);
      const failed = results.flatMap((result, index) =>
        result.status === "rejected" ? [pendingDepartments[index]] : []
      );
      const completed = [...new Set([...submittedDepartments, ...successful])];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);
      if (draftKey) localStorage.setItem(draftKey, JSON.stringify({ values, submittedDepartments: completed }));
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(`submitted_depts_${values.Email}`, JSON.stringify(completed));
      }
      successful.forEach((department) => toast.success(`Application submitted for ${getDepartmentDisplayName(department)}.`));

      if (failed.length) {
        setErrorMessage(`Submitted ${successful.length ? successful.map(getDepartmentDisplayName).join(", ") : "no applications"}. Please retry ${failed.map(getDepartmentDisplayName).join(", ")}.`);
        setIsSubmitting(false);
      } else {
        if (draftKey) {
          localStorage.removeItem(draftKey);
        }
        toast.success("Application submitted successfully! Redirecting home...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    } catch {
      setErrorMessage("Your applications could not be submitted. Your saved answers will be kept for retrying.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking your application status...</p>
        </div>
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Card className="border-border bg-card p-8 shadow-sm">
          <CardTitle className="text-2xl font-bold text-foreground">Recruitment Closed</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Recruitment has now concluded. Thank you for your interest.
          </CardDescription>
          <Button className="mt-6" variant="outline" onClick={() => router.push("/departments")}>
            Back to Departments
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recruitment Application
            </Badge>
            <span className="text-xs text-muted-foreground">
              Auto-saves draft locally
            </span>
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-card-foreground">
              Application Form
            </CardTitle>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Applying to:</span>
              {departmentNames.map((dept) => {
                const p = getDepartmentPriority(dept);
                return (
                  <Badge key={dept} variant="secondary" className="text-sm font-semibold px-3 py-1 flex items-center gap-2">
                    <span>{getDepartmentDisplayName(dept)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      Priority {p}
                    </span>
                  </Badge>
                );
              })}
              {departmentNames.length === 2 && !submittedDepartments.length && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={swapFormPriorities}
                  className="text-xs font-medium h-7 px-2 ml-1"
                >
                  ⇄ Swap Priorities
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {errorMessage && !isSubmitting && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">{errorMessage}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/departments")}
                  className="border-destructive/30 hover:bg-destructive/20 text-xs"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to Departments
                </Button>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <section className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    Personal Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Provide your contact and academic information.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name <span className="text-destructive font-semibold" aria-hidden="true" title="Required">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Jane Doe" maxLength={100} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RegistrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Registration Number <span className="text-destructive font-semibold" aria-hidden="true" title="Required">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. 25BCE5612"
                            maxLength={9}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Gender <span className="text-destructive font-semibold" aria-hidden="true" title="Required">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            value={field.value || ""}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground aria-invalid:border-destructive aria-invalid:ring-destructive"
                          >
                            <option value="" disabled>
                              Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone (WhatsApp) <span className="text-destructive font-semibold" aria-hidden="true" title="Required">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            placeholder="9876543210"
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" ||
                                e.key === "Delete" ||
                                e.key === "Tab" ||
                                e.key === "Escape" ||
                                e.key === "Enter" ||
                                e.key === "ArrowLeft" ||
                                e.key === "ArrowRight" ||
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown" ||
                                e.key === "Home" ||
                                e.key === "End" ||
                                e.ctrlKey ||
                                e.metaKey
                              ) {
                                return;
                              }
                              if (!/^[0-9]$/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="Email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              type="email"
                              className="bg-muted text-muted-foreground cursor-not-allowed"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Authenticated via your account (read-only).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground tracking-tight">
                    General Questions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This question is shared across all your department applications.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name={UNIVERSAL_QUESTION_ID}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground leading-relaxed flex items-center">
                        <span>{UNIVERSAL_QUESTION.name}</span>
                        <span className="ml-1 font-semibold text-destructive" aria-hidden="true" title="Required">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          rows={4}
                          placeholder={UNIVERSAL_QUESTION.placeholder}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between pt-0.5">
                        <FormMessage />
                        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                          {(field.value || "").length} / 5000
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </section>

              {departmentNames[0] && (
                <>
                  <Separator />
                  {renderDepartmentQuestions(departmentNames[0], QuestionnaireData, form, getDepartmentPriority(departmentNames[0]))}
                </>
              )}

              {departmentNames[1] && (
                <>
                  <Separator />
                  {renderDepartmentQuestions(departmentNames[1], QuestionnaireData, form, getDepartmentPriority(departmentNames[1]))}
                </>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/departments")}
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Departments
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 font-medium shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const renderDepartmentQuestions = (department, QuestionnaireData, form, priorityNumber) => {
  const normalizeDeptName = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");
  const questions = (
    QuestionnaireData.find(qd => normalizeDeptName(qd.department) === normalizeDeptName(department))?.questions ?? []
  )
    .map(normaliseQuestion)
    .filter(
      (question) =>
        question.id !== UNIVERSAL_QUESTION_ID &&
        question.name !== UNIVERSAL_QUESTION.name &&
        question.name !== "Why do you want to join Organization Name?" &&
        question.name !== "Why do you want to join DWASFW?"
    );

  if (!questions.length) return null;

  const deptDisplayName = getDepartmentDisplayName(department);

  return (
    <section className="space-y-6">
      <div className="border-l-2 border-primary pl-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            {deptDisplayName} Questions
          </h2>
          {priorityNumber && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Priority {priorityNumber}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Department-specific questions for {deptDisplayName}.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((question) => {
          const isCompact = question.type === "short-text";
          const label = resolveQuestionLabel(question.id);
          const placeholder = sanitizePlaceholder(question.placeholder, isCompact);

          return (
            <FormField
              key={question.id}
              control={form.control}
              name={question.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground leading-relaxed flex flex-wrap items-center gap-1.5">
                    <span>{label}</span>
                    {question.optional ? (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground border border-border/60">
                        Optional
                      </span>
                    ) : (
                      <span className="font-semibold text-destructive" aria-hidden="true" title="Required">
                        *
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {isCompact ? (
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={placeholder}
                      />
                    ) : (
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={4}
                        placeholder={placeholder}
                      />
                    )}
                  </FormControl>
                  <div className="flex items-center justify-between pt-0.5">
                    <FormMessage />
                    {!isCompact && (
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {(field.value || "").length} / 5000
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </section>
  );
};

export default FormComp;

