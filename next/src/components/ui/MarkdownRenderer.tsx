import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => (
          <h1 className="text-3xl font-bold my-8" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-2xl font-semibold my-6" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-xl font-medium my-2" {...props} />
        ),
        h4: ({ ...props }) => (
          <h4 className="text-lg font-medium my-2" {...props} />
        ),
        p: ({ ...props }) => <p className="my-2" {...props} />,
        ul: ({ ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
        ol: ({ ...props }) => (
          <ol className="list-decimal pl-6 my-2" {...props} />
        ),
        li: ({ ...props }) => <li className="my-1" {...props} />,
        a: ({ ...props }) => <a className="font-bold underline" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-2"
            {...props}
          />
        ),
        code: ({ className, children, ...props }) => {
          // Check if this code is inline by examining the parent node type
          const isInline = !className;

          // If it's inline code, render with inline styling
          if (isInline) {
            return (
              <code
                className="bg-inline-code text-inline-code-foreground p-1 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          // Otherwise, it's a code block, use the CodeBlock component
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : 'ascii';
          const value = String(children).replace(/\n$/, '');

          return <CodeBlock language={language} value={value} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
