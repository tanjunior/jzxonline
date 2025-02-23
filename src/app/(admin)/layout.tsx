import "~/styles/globals.css";

import { type Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "~/server/auth";
import { AdminSidebar } from "~/components/admin/SideBar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import AdminHeader from "~/components/admin/Header";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user.role) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  } else if (session.user.role != "admin") {
    redirect("/", RedirectType.replace);
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex flex-1">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
