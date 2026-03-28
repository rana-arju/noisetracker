import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata = {
  title: "Admin Login - Noise Tracker",
  description: "Admin moderation panel login",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <AdminLoginForm />
    </div>
  );
}
