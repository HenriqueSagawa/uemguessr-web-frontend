import type { Metadata } from "next";
import { ResetPasswordFlow } from "@/components/auth/reset-password-flow";

export const metadata: Metadata = {
  title: "Redefinir senha | UEMGuessr",
  description: "Recupere o acesso à sua conta do UEMGuessr.",
};

export default function ForgotPasswordPage() {
  return <ResetPasswordFlow />;
}