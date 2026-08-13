import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Criar conta | UEMGuessr",
  description: "Crie sua conta no UEMGuessr e comece a explorar o campus.",
};

export default function SignupPage() {
  return <SignupForm />;
}