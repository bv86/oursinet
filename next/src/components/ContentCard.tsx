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
    <Link href={`/${basePath}/${slug}`}>
      <Card className="flex flex-row w-full gap-0 h-[200px]">
        {logo && (
          <CardContent>
            <StrapiImage
              src={logo.url}
              alt={logo.alternativeText || 'No alternative text provided'}
              width={160}
              height={160}
              className="rounded-2xl h-full object-cover"
            />
          </CardContent>
        )}
        <CardContent className="flex flex-col gap-2 w-0 flex-grow overflow-hidden">
          <h2 className="font-bold text-2xl">{title}</h2>
          <div className="line-clamp-4 overflow-hidden text-ellipsis h-0 flex-grow">
            {description}
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {formatDate(createdAt)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
