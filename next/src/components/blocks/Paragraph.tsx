import { ParagraphProps } from '@/lib/types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="px-4 lg:px-0">
      <MarkdownRenderer content={content} />
    </div>
  );
}
