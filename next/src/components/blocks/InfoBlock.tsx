import Link from 'next/link';
import { StrapiImage } from '../ui/StrapiImage';
import { InfoBlockProps } from '@/lib/types';
import { Button } from '../ui/button';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export function InfoBlock({
  reversed,
  image,
  title,
  content,
  cta,
}: Readonly<InfoBlockProps>) {
  return (
    <section
      className={`flex gap-8 w-full flex-col pl-2 pr-2 ${
        reversed
          ? 'md:flex-row-reverse md:pl-4 md:pr-0'
          : 'md:flex-row md:pr-4 md:pl-0'
      }`}
    >
      {image && (
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || 'No alternative text provided'}
          height={500}
          width={600}
          className="hidden md:block md:w-auto md:max-w-1/2 md:rounded-3xl md:object-cover"
        />
      )}
      <div className="flex flex-col gap-2 md:gap-4 items-start">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="">
          {image && (
            <StrapiImage
              src={image.url}
              alt={image.alternativeText || 'No alternative text provided'}
              height={500}
              width={600}
              className={`${
                reversed ? 'float-right ml-4' : 'float-left mr-4'
              } mt-1 md:hidden max-w-1/3 md:rounded-r-3xl md:object-cover rounded-sm`}
            />
          )}
          <MarkdownRenderer content={content} />
          {cta && (
            <Button className="mt-4">
              <Link
                href={cta.href}
                target={cta.isExternal ? '_blank' : '_self'}
              >
                {cta.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
