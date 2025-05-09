'use client';

import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-80 transition-opacity cursor-pointer"
      aria-label="Copy code to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
