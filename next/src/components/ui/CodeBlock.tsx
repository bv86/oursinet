import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CopyButton from './CopyButton';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton text={value} />
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '0.375rem',
          padding: '1rem',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
        showLineNumbers
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
