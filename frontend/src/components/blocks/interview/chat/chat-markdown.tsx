/* eslint react/no-children-prop: 0 */

import 'katex/dist/katex.min.css';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultCopyCodeText = 'Copy Code';

export const MarkdownComponent = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <Markdown
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[remarkMath, remarkGfm]}
      className={cn('', className)}
      components={{
        code({ children, className, ...rest }) {
          const [copyCodeText, setCopyCodeText] = useState('Copy Code');

          const match = /language-(\w+)/.exec(className || '');

          const onCopy = (code: string) => {
            const language = match?.[1];

            if (language) {
              localStorage.setItem('ai-asst-lang', language);
            }

            navigator.clipboard.writeText(code);
            setCopyCodeText('Copied!');
            setTimeout(() => {
              setCopyCodeText(defaultCopyCodeText);
            }, 3000);
          };

          return match ? (
            <div className='flex flex-col'>
              <div className='inline-flex translate-y-[10px] items-center justify-between rounded-t-sm bg-gray-700 p-1 text-sm'>
                <span className='px-2'>{match[1]}</span>
                <Button
                  variant='ghost'
                  className='flex h-6 flex-row gap-2 font-sans'
                  onClick={() => {
                    onCopy(String(children));
                  }}
                >
                  <span>{copyCodeText}</span>
                  {copyCodeText !== defaultCopyCodeText ? (
                    <CheckIcon className='text-green-600' />
                  ) : (
                    <CopyIcon />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                {...rest}
                ref={null}
                PreTag='div'
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                className='rounded-t-none'
                style={oneDark}
              />
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
};
