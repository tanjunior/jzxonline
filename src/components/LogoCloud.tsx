import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import Image from "next/image";

export default function LogoCloud() {
  return (
    <section className="w-full overflow-hidden bg-transparent py-16">
      <div className="group absolute bottom-0 m-auto w-full">
        <div className="flex flex-col items-center md:flex-row">
          <div className="relative py-6 md:w-full">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  fill
                />
              </div>

              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/column.svg"
                  alt="Column Logo"
                  fill
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/github.svg"
                  alt="GitHub Logo"
                  fill
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  fill
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                  alt="Lemon Squeezy Logo"
                  fill
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/laravel.svg"
                  alt="Laravel Logo"
                  fill
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-7 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lilly.svg"
                  alt="Lilly Logo"
                  fill
                />
              </div>

              <div className="flex">
                <Image
                  className="mx-auto h-6 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/openai.svg"
                  alt="OpenAI Logo"
                  fill
                />
              </div>
            </InfiniteSlider>

            <div className="bg-linear-to-r absolute inset-y-0 left-0 w-20 from-background"></div>
            <div className="bg-linear-to-l absolute inset-y-0 right-0 w-20 from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
