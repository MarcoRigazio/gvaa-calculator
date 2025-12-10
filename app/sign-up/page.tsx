// app/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-4">
        <SignUp
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
