import { FullImageProps } from '@/lib/types';
import { StrapiImage } from '../ui/StrapiImage';

export function FullImage({ image }: Readonly<FullImageProps>) {
  return (
    <div className="px-4 lg:px-0">
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || 'No alternative text provided'}
        width={1920}
        height={1080}
        className="object-cover"
      />
    </div>
  );
}
