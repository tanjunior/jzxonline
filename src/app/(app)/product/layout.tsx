import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1">
        <div className="container mx-auto flex flex-1 flex-col gap-4 p-4 px-4 pt-0">
          {children}
        </div>
      </div>
    </>
  );
}
