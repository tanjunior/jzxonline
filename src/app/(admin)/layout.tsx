import "~/styles/globals.css";

import { type Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "~/server/auth";
import { Sidebar } from "~/components/admin/SideBar";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user.role) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  } else if (session.user.role != "admin") {
    redirect("/", RedirectType.replace);
  }

  // Implement authorization logic here (e.g., check if the user has the "admin" role)
  const isAdmin = true; // Replace with your actual authorization logic

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}