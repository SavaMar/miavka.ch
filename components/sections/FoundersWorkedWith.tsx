import Image from "next/image";

const FOUNDERS = [
  {
    logo: "/images/founders/Asgard.png",
    href: "https://asgardsportacademy.ch/en/home/",
    labelBar: "Asgard Academy Zurich",
    description: "Jiu Jitsu & Boxing academy in ZH",
  },
  {
    logo: "/images/founders/Fusion.png",
    href: "https://fusionsports.ch/",
    labelBar: "Fusion Sport Academy",
    description: "Kickboxing, MMA, Jiu Jitsu gym in BE",
  },
  {
    logo: "/images/founders/joshmitsu.png",
    href: "https://www.joshimitsubjj.ch/",
    labelBar: "Joshmitzu BJJ Solothurn",
    description: "Jiu Jitsu academy in Solothurn",
  },
] as const;

export default function FoundersWorkedWith() {
  return (
    <section className="bg-white px-6 py-16 md:px-10 md:py-28 lg:px-16">
      <h2
        className="mb-12 text-center uppercase leading-none text-brand-black md:mb-16 text-[clamp(1.25rem,4vw,2.25rem)]"
        style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
      >
        Founders I&apos;ve Worked With
      </h2>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {FOUNDERS.map((founder) => (
          <a
            key={founder.href}
            href={founder.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
          >
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-5 pb-8 pt-10">
              <div className="relative isolate aspect-4/3 w-full max-w-[200px]">
                <Image
                  src={founder.logo}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 80vw, 200px"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="bg-brand-black px-3 py-3.5 text-center">
              <span className="block font-body text-[11px] font-bold uppercase leading-snug tracking-wide text-white transition-colors duration-300 group-hover:text-brand-red md:text-xs">
                {founder.labelBar}
              </span>
            </div>

            <p className=" bg-white px-4 py-3 text-center font-body text-[11px] font-normal leading-relaxed text-zinc-600 md:text-xs">
              {founder.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
