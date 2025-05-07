import { ParagraphWithImageProps } from '@/lib/types';
import { StrapiImage } from '../ui/StrapiImage';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export function ParagraphWithImage({
  content,
  image,
  reversed,
}: Readonly<ParagraphWithImageProps>) {
  return (
    <div
      className={`flex gap-4 w-full flex-col px-4 lg:px-0 ${
        reversed ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {image && (
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || 'No alternative text provided'}
          height={500}
          width={600}
          className="hidden md:block md:w-auto md:max-w-1/2 md:rounded-r-3xl md:object-cover"
        />
      )}
      <div className="flex flex-col gap-1 md:gap-2 items-start">
        <div>
          {image && (
            <StrapiImage
              src={image.url}
              alt={image.alternativeText || 'No alternative text provided'}
              height={500}
              width={600}
              className={`${
                reversed ? 'float-right ml-2' : 'float-left mr-2'
              } mt-1 md:hidden max-w-1/3 md:rounded-r-3xl md:object-cover rounded-sm`}
            />
          )}
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
