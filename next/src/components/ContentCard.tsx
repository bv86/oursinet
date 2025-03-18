import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { StrapiImage } from "./ui/StrapiImage";
import { ImageProps } from "@/lib/types";

export interface ContentCardProps {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  createdAt: string;
  basePath: string;
}

export function ContentCard({
  title,
  description,
  slug,
  image,
  basePath,
}: Readonly<ContentCardProps>) {
  return (
    <Link href={`/${basePath}/${slug}`}>
      <Card className="flex flex-row w-full gap-0">
        <CardContent>
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || "No alternative text provided"}
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{title}</h2>
          <div>{description.slice(0, 144)}...</div>
        </CardContent>
      </Card>
    </Link>
  );
}
