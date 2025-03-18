import { ContentCard, type ContentCardProps } from "@/components/ContentCard";
export const BlogCard = (props: Readonly<ContentCardProps>) => (
  <ContentCard {...props} basePath="blog" />
);
