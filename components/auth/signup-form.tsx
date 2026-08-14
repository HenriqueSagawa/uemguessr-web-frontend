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
import { api, ApiError } from "@/lib/api";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

export function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maybeCreated, setMaybeCreated] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!USERNAME_RE.test(username)) {
      setError(
        "O apelido precisa ter de 3 a 30 caracteres, usando só letras, números e underscore."
      );
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Digite um email válido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
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
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email: email.trim(), password }),
      });
      router.push(`/verificar-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("Esse apelido ou email já está em uso. Tente outro.");
        } else {
          setError(err.message);
          setMaybeCreated(true);
        }
      } else {
        setError("Não foi possível conectar ao servidor.");
        setMaybeCreated(true);
      }
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-baseline justify-between">
            <Label htmlFor="username" className="text-[13px]">
              Apelido
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Seu nome de guerra no campus
            </span>
          </div>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="ex: joao_silva"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <div className="flex flex-col gap-1">
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {error}
            </p>
            {maybeCreated ? (
              <Link
                href={`/verificar-email?email=${encodeURIComponent(email.trim())}`}
                className="text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
              >
                Sua conta pode ter sido criada — reenviar o código de verificação
              </Link>
            ) : null}
          </div>
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