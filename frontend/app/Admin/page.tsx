import { AdminDashboard } from "@/components/admin-dashboard";
import { AuthProvider } from "@/components/aut-provider";
export default function Home() {
  return (
    <div>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </div>
  );
}