import type { Metadata } from "next";
import { EmailVerification } from "@/components/auth/email-verification";

export const metadata: Metadata = {
  title: "Verifique seu email | UEMGuessr",
  description: "Digite o código enviado para o seu email para confirmar sua conta.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  return <EmailVerification email={email} />;
}