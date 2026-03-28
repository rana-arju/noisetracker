import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "লগইন - নয়েজ ট্র্যাকার",
  description: "আপনার নয়েজ ট্র্যাকার অ্যাকাউন্টে লগইন করুন",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <LoginForm />
    </div>
  );
}
