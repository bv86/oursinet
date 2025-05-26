import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { StrapiImage } from './ui/StrapiImage';
import { ImageProps } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export interface ContentCardProps {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  logo: ImageProps;
  image: ImageProps;
  createdAt: string;
  basePath: string;
}

export function ContentCard({
  title,
  description,
  slug,
  logo,
  basePath,
  createdAt,
}: Readonly<ContentCardProps>) {
  return (
    <Link href={`${basePath}/${slug}`}>
      <Card className="flex flex-row w-full p-2 md:p-4 gap-2 md:gap-4 h-[150px] md:h-[200px] overflow-hidden">
        {logo && (
          <CardContent className="h-full aspect-square p-0">
            <StrapiImage
              src={logo.url}
              alt={logo.alternativeText || 'No alternative text provided'}
              width={160}
              height={160}
              className="rounded-2xl h-full w-auto object-cover aspect-square"
            />
          </CardContent>
        )}
        <CardContent className="flex flex-col gap-0 md:gap-2 w-0 flex-grow h-full overflow-hidden p-0">
          <h2 className="font-bold text-md md:text-2xl line-clamp-2 text-ellipsis">
            {title}
          </h2>
          <div className="w-full h-0 flex-grow overflow-hidden line-clamp-2 wrap-break-word">
            <p className="text-sm md:text-lg display-inline text-ellipsis line-clamp-2">
              {description}
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {formatDate(createdAt)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
