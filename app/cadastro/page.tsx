import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

export const metadata: Metadata = {
  title: "Criar conta | UEMGuessr",
  description: "Crie sua conta no UEMGuessr e comece a explorar o campus.",
};

export default function SignupPage() {
  return (
    <RedirectIfAuthed>
      <SignupForm />
    </RedirectIfAuthed>
  );
}