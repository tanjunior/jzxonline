import { AnimatedHero } from "~/components/shop/AnimatedHero";

export default async function Home() {
  return (
    <div className="-mt-16 flex min-h-screen flex-1 flex-col items-center justify-center">
      <AnimatedHero />
    </div>
  );
}
