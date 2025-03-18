import { ParagraphProps } from "@/lib/types";
import React from "react";
import ReactMarkdown from "react-markdown";

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
