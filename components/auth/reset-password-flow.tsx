"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { OtpInput } from "@/components/auth/otp-input";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { useCountdown } from "@/components/auth/use-countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "Código" },
  { id: 3, label: "Nova senha" },
];

export function ResetPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { seconds, start } = useCountdown(60);

  const goToStep = (next: number) => {
    setError(null);
    setStep(next);
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Digite um email válido para enviarmos o código.");
      return;
    }
    setLoading(true);
    try {
      await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      start();
      goToStep(2);
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

  const handleVerifyCode = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      goToStep(3);
    }, 500);
  };

  const handleResend = async () => {
    setCode("");
    setError(null);
    try {
      await api("/auth/forgot-password", {
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

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          code,
          newPassword: password,
        }),
      });
      setDone(true);
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

  if (done) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
            <CheckCircle2 className="size-6 text-emerald-500" />
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Senha atualizada!
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sua nova senha já está valendo. Use-a para entrar na sua conta.
          </p>
        </div>

        <div className="mt-8">
          <Button
            render={<Link href="/login" />}
            className="h-11 w-full rounded-full text-sm font-semibold"
          >
            Ir para o login
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => goToStep(Math.max(1, step - 1))}
          className={cn(
            "flex w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
            step === 1 && "pointer-events-none opacity-0"
          )}
        >
          <ArrowLeft className="size-3.5" />
          Voltar
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {step === 1 && "Recuperar acesso"}
            {step === 2 && "Código de verificação"}
            {step === 3 && "Criar nova senha"}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step === 1 &&
              "Digite seu email e enviaremos um código para redefinir sua senha."}
            {step === 2 &&
              "Enviamos um código de 6 dígitos. Ele expira em 15 minutos."}
            {step === 3 &&
              "Escolha uma senha nova. Tente algo que nem você adivinha depois."}
          </p>
        </div>

        <ol className="mt-2 flex items-center gap-2" aria-label="Progresso">
          {STEPS.map((item, index) => {
            const isDone = item.id < step;
            const isActive = item.id === step;
            return (
              <li
                key={item.id}
                className="flex flex-1 items-center gap-2 last:flex-none"
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                    isDone &&
                      "bg-emerald-500 text-white",
                    isActive &&
                      "bg-linear-to-br from-blue-500 via-indigo-500 to-violet-600 text-white ring-4 ring-primary/15",
                    !isDone && !isActive && "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : item.id}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
                {index < STEPS.length - 1 ? (
                  <span className="mx-1 h-px flex-1 bg-border" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendCode} className="mt-8 flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reset-email" className="text-[13px]">
              Email
            </Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl px-3.5"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full text-sm font-semibold"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Enviando..." : "Enviar código"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-opacity hover:opacity-80"
            >
              Entrar
            </Link>
          </p>
        </form>
      ) : null}

      {step === 2 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyCode();
          }}
          className="mt-8 flex flex-col gap-5"
          noValidate
        >
          <OtpInput
            length={6}
            value={code}
            onChange={(value) => {
              setCode(value);
              if (error) setError(null);
            }}
            onComplete={handleVerifyCode}
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

          <button
            type="button"
            onClick={handleResend}
            disabled={seconds > 0}
            className="mx-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="size-3.5" />
            {seconds > 0
              ? `Reenviar em 0:${seconds.toString().padStart(2, "0")}`
              : "Reenviar código"}
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <form onSubmit={handleReset} className="mt-8 flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password" className="text-[13px]">
              Nova senha
            </Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl px-3.5"
              required
            />
            <PasswordStrength password={password} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-[13px]">
              Confirmar nova senha
            </Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 rounded-xl px-3.5"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full text-sm font-semibold"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </form>
      ) : null}
    </AuthShell>
  );
}