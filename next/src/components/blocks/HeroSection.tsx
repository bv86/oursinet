import { HeroSectionProps } from "@/lib/types";
import Link from "next/link";
import { StrapiImage } from "../ui/StrapiImage";
import { Button } from "../ui/button";

export function HeroSection({ title, cta, image }: Readonly<HeroSectionProps>) {
  return (
    <section className="relative md:min-h-[500px]">
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover object-center rounded-b-3xl"
        width={1920}
        height={1080}
      />
      <div className="flex flex-col w-full h-full items-center justify-center p-8 md:pt-12 md:pb-12 gap-8">
        <div className="flex-grow flex flex-row items-center">
          <h1 className="text-primary-foreground font-bold text-2xl md:text-6xl [text-shadow:_1px_2px_1px_rgb(0_0_0_/_60%)]">
            {title}
          </h1>
        </div>
        {cta && (
          <Button>
            <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
              {cta.text}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
