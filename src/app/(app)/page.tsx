import LogoCloud from "~/components/LogoCloud";
import { AnimatedHero } from "~/components/shop/AnimatedHero";
import HeroSection from "~/components/shop/HeroSection";

export default async function Home() {
  // return <HeroSection />;
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <AnimatedHero />
    </div>
  );
}
