import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-accent" />
        <div className="aspect-video rounded-xl bg-accent" />
        <div className="aspect-video rounded-xl bg-accent" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-accent md:min-h-min" />
    </HydrateClient>
  );
}
