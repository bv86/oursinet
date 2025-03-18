import { type Locale } from "@/config";
import { type NextPage } from "next/types";

export type LocalizedPage<T = object> = NextPage<{
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<T>;
}>;
export type LocalizedStrapiPage = NextPage<{
  params: Promise<{ locale: Locale; slug: string }>;
}>;

export interface LinkProps {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
}

export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface LogoProps {
  logoText: string;
  image: ImageProps;
}

export interface ArticleProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

type ComponentType =
  | "blocks.hero-section"
  | "blocks.info-block"
  | "blocks.heading"
  | "blocks.paragraph-with-image"
  | "blocks.paragraph"
  | "blocks.full-image";

interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block =
  | HeroSectionProps
  | InfoBlockProps
  | HeadingProps
  | ParagraphWithImageProps
  | ParagraphProps
  | FullImageProps;

export interface HeroSectionProps extends Base<"blocks.hero-section"> {
  title: string;
  image: ImageProps;
  cta?: LinkProps;
}

export interface InfoBlockProps extends Base<"blocks.info-block"> {
  reversed?: boolean;
  title: string;
  content: string;
  image: ImageProps;
  cta?: LinkProps;
}

export interface HeadingProps extends Base<"blocks.heading"> {
  heading: string;
  linkId?: string;
}

export interface ParagraphWithImageProps
  extends Base<"blocks.paragraph-with-image"> {
  content: string;
  image: ImageProps;
  reversed?: boolean;
}

export interface ParagraphProps extends Base<"blocks.paragraph"> {
  content: string;
}

export interface FullImageProps extends Base<"blocks.full-image"> {
  id: number;
  __component: "blocks.full-image";
  image: ImageProps;
}
