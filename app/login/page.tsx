import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar | UEMGuessr",
  description: "Entre na sua conta do UEMGuessr e continue explorando o campus.",
};

export default function LoginPage() {
  return <LoginForm />;
}