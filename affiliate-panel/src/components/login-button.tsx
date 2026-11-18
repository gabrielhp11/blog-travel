import { signIn } from "@/lib/auth";

export function LoginButton() {
  return (
    <form action={async () => {
      "use server";
      await signIn("google", { redirectTo: "/dashboard" });
    }}>
      <button className="button" type="submit">Continuar com Google</button>
    </form>
  );
}
