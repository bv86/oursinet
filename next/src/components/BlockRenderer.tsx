import { HeroSection } from "@/components/blocks/HeroSection";
import { Block } from "@/lib/types";
import { InfoBlock } from "./blocks/InfoBlock";
import { FullImage } from "./blocks/FullImage";
import { Heading } from "./blocks/Heading";
import { Paragraph } from "./blocks/Paragraph";
import { ParagraphWithImage } from "./blocks/ParagraphWithImage";

function blockRenderer(block: Block, index: number) {
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...block} key={index} />;
    case "blocks.full-image":
      return <FullImage {...block} key={index} />;
    case "blocks.heading":
      return <Heading {...block} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...block} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...block} key={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => blockRenderer(block, index));
}
