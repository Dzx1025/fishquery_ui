import { LoginForm } from "@/components/auth/login-form";
import { SmartHeader } from "@/components/auth/smart-header";

export default function Page() {
  return (
    <>
      <SmartHeader />

      <div className="flex min-h-[calc(100vh-4rem)]  w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
