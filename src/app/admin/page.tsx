import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./admin-dashboard";

const COOKIE_NAME = "cattery_admin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}

export const dynamic = "force-dynamic";
