"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Preencha email e senha para entrar.");
      return;
    }
    setLoading(true);
    setTimeout(() => router.push("/"), 900);
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Entrar na sua conta
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Continue de onde você parou e mantenha sua pontuação engenhosa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[13px]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl px-3.5"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px]">
              Senha
            </Label>
            <Link
              href="/esqueci-senha"
              className="text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
            >
              Esqueci minha senha
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl px-3.5"
            required
          />
        </div>

        {error ? (
          <p role="alert" className="text-[13px] font-medium text-destructive">
            {error}
          </p>
        ) : null}

        <Label className="flex cursor-pointer items-center gap-2 text-[13px] font-normal text-muted-foreground">
          <Checkbox
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          Lembrar de mim por 30 dias
        </Label>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full text-sm font-semibold"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          ou
        </span>
        <Separator className="flex-1" />
      </div>

      <GoogleButton />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="font-medium text-primary transition-opacity hover:opacity-80"
        >
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}