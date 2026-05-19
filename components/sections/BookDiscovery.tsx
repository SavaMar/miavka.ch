import Image from "next/image";
import DiscoveryCallButton from "@/components/sections/DiscoveryCallButton";

export default function BookDiscovery() {
  return (
    <section className="bg-brand-cream relative overflow-hidden py-12 md:py-16">
      {/* Oversized logo watermark — cut off at left edge */}
      <div className="absolute left-[70px] top-[32px] hidden w-full opacity-50 md:block">
        <Image
          src="/images/logo.png"
          alt=""
          width={350}
          height={350}
          className="object-contain"
        />
      </div>

      <div className="flex justify-center">
        <DiscoveryCallButton variant="light" />
      </div>
    </section>
  );
}
