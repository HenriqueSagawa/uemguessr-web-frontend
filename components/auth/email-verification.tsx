"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { OtpInput } from "@/components/auth/otp-input";
import { useCountdown } from "@/components/auth/use-countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api, ApiError, setAccessToken } from "@/lib/api";
import type { AuthTokens } from "@/lib/api-types";
import { useSession } from "@/lib/session";

function maskEmail(email: string) {
  if (!email.includes("@")) return email;
  const [user, domain] = email.split("@");
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(3, user.length - 2))}@${domain}`;
}

interface EmailVerificationProps {
  email?: string;
}

export function EmailVerification({ email: emailFromUrl }: EmailVerificationProps) {
  const router = useRouter();
  const { completeAuth } = useSession();
  const [email, setEmail] = useState(emailFromUrl ?? "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const { seconds, start } = useCountdown(60, true);

  const target = email || "seuemail@email.com";

  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => router.push("/lobby"), 1500);
      return () => clearTimeout(timer);
    }
  }, [verified, router]);

  const handleSubmit = async (value = code) => {
    setError(null);
    if (value.length < 6) return;
    if (!email.trim()) {
      setError("Digite o email usado no cadastro.");
      return;
    }
    setLoading(true);
    try {
      const response = await api<AuthTokens>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), code: value }),
      });
      setAccessToken(response.accessToken);
      completeAuth(response.user);
      setVerified(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCode("");
    setError(null);
    if (!email.trim()) {
      setError("Digite o email usado no cadastro.");
      return;
    }
    try {
      await api("/auth/resend-code", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      start();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  if (verified) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
            <Mail className="size-6 text-emerald-500" />
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Email verificado!
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sua conta está pronta. Levando você para o lobby...
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={() => router.push("/lobby")}
            className="h-11 w-full rounded-full text-sm font-semibold"
          >
            Entrar no jogo
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verifique seu email
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-medium text-foreground">{maskEmail(target)}</span>
          . Ele expira em 15 minutos.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-8 flex flex-col gap-5"
        noValidate
      >
        {!emailFromUrl ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="verify-email" className="text-[13px]">
              Email usado no cadastro
            </Label>
            <Input
              id="verify-email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl px-3.5"
              required
            />
          </div>
        ) : null}

        <OtpInput
          length={6}
          value={code}
          onChange={(value) => {
            setCode(value);
            if (error) setError(null);
          }}
          onComplete={handleSubmit}
          disabled={loading}
        />

        {error ? (
          <p role="alert" className="text-[13px] font-medium text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading || code.length < 6}
          className="h-11 w-full rounded-full text-sm font-semibold"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Verificando..." : "Verificar código"}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          não recebeu?
        </span>
        <Separator className="flex-1" />
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={seconds > 0}
        className="mx-auto mt-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className="size-3.5" />
        {seconds > 0
          ? `Reenviar em 0:${seconds.toString().padStart(2, "0")}`
          : "Reenviar código"}
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Abriu em outra conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary transition-opacity hover:opacity-80">
          Criar com outro email
        </Link>
      </p>
    </AuthShell>
  );
}