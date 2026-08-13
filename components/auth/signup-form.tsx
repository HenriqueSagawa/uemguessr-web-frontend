"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ra, setRa] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha nome, email e senha para criar sua conta.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!terms) {
      setError("Você precisa aceitar os Termos de Uso para continuar.");
      return;
    }

    setLoading(true);
    setTimeout(
      () =>
        router.push(
          `/verificar-email?email=${encodeURIComponent(email.trim())}`
        ),
      900
    );
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Criar sua conta
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Leva menos de um minuto. Depois disso, a UEM inteira é sua.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-[13px]">
            Nome completo
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl px-3.5"
            required
          />
        </div>

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
          <div className="flex items-baseline justify-between">
            <Label htmlFor="ra" className="text-[13px]">
              RA (opcional)
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Somente para quem é da UEM
            </span>
          </div>
          <Input
            id="ra"
            type="text"
            autoComplete="off"
            inputMode="numeric"
            placeholder="12345-6"
            value={ra}
            onChange={(e) => setRa(e.target.value.replace(/\D/g, ""))}
            className="h-11 rounded-xl px-3.5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-[13px]">
            Senha
          </Label>
          <PasswordInput
            id="password"
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
          <Label htmlFor="confirm" className="text-[13px]">
            Confirmar senha
          </Label>
          <PasswordInput
            id="confirm"
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

        <Label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug font-normal text-muted-foreground">
          <Checkbox
            className="mt-0.5"
            checked={terms}
            onCheckedChange={(checked) => setTerms(checked === true)}
          />
          <span>
            Li e aceito os{" "}
            <a href="#" className="font-medium text-primary transition-opacity hover:opacity-80">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="#" className="font-medium text-primary transition-opacity hover:opacity-80">
              Política de Privacidade
            </a>
          </span>
        </Label>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full text-sm font-semibold"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-opacity hover:opacity-80"
        >
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}