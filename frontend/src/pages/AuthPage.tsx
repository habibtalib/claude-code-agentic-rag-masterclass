import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export function AuthPage() {
  const { signIn, signUp } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm onSignIn={signIn} onSignUp={signUp} />
    </div>
  );
}
