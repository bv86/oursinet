import { HeadingProps } from '@/lib/types';
import React from 'react';
export function Heading({ heading, linkId }: Readonly<HeadingProps>) {
  return (
    <h3 className="font-bold text-2xl px-4 lg:px-0" id={linkId}>
      {heading}
    </h3>
  );
}
