import { ParagraphProps } from '@/lib/types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="">
      <MarkdownRenderer content={content} />
    </div>
  );
}
