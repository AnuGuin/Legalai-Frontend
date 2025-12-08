"use client"

import LoginForm from "@/components/ui/login-form"

interface AuthPageProps {
  onAuthenticated: (user: { name: string; email: string} ) => void;
  mode?: 'login' | 'register';
}

export function AuthPage({ onAuthenticated, mode = 'login' }: AuthPageProps) {
  return <LoginForm onAuthenticated={onAuthenticated} mode={mode} />
}