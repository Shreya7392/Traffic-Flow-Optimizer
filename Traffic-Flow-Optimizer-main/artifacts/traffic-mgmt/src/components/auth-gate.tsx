import { FormEvent, ReactNode, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

const tokenKey = "traffic-control-token";

export function AuthGate({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  setAuthTokenGetter(() => token);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const response = await fetch("http://localhost:3000/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) return setError("Invalid email or password");
    const data = await response.json() as { token: string };
    localStorage.setItem(tokenKey, data.token);
    setToken(data.token);
  };
  if (token) return <>{children}</>;
  return <main className="min-h-screen grid place-items-center bg-background p-6 font-mono"><form onSubmit={login} className="w-full max-w-sm space-y-4 border border-border bg-card p-6 rounded-lg"><h1 className="text-xl font-bold uppercase">Traffic Control Login</h1><p className="text-xs text-muted-foreground">Use the administrator credentials in the API .env file.</p><input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-input bg-background p-2"/><input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-input bg-background p-2"/>{error && <p className="text-xs text-destructive">{error}</p>}<button className="w-full rounded bg-primary p-2 text-primary-foreground font-bold">Sign in</button></form></main>;
}
