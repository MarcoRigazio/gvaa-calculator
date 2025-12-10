// app/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-4">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-sky-500 hover:bg-sky-400",
            },
          }}
        />
      </div>
    </main>
  );
}
