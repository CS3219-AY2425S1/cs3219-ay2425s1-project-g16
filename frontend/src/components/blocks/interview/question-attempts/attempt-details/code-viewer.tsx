import { Check, Copy } from 'lucide-react';
import { FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type ICodeProps = {
  code: string;
  language: string;
};

const defaultCopyCodeText = 'Copy Code';

export const CodeViewer: FC<ICodeProps> = ({ code, language }) => {
  const [copyCodeText, setCopyCodeText] = useState('Copy Code');

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopyCodeText('Copied!');
    setTimeout(() => {
      setCopyCodeText(defaultCopyCodeText);
    }, 3000);
  };

  return (
    <div className='flex size-full flex-col text-clip rounded-md'>
      <div className='bg-muted-foreground text-muted dark:bg-muted dark:text-muted-foreground flex w-full items-center justify-between px-3 py-2'>
        <span className='text-sm font-medium'>{language}</span>
        <Button
          variant='secondary'
          size='sm'
          onClick={onCopy}
          className='border-border dark:text-muted-foreground text-muted hover:text-primary dark:hover:bg-primary/10 group flex items-center gap-2 bg-inherit disabled:cursor-not-allowed'
        >
          <span>{copyCodeText}</span>
          {copyCodeText === defaultCopyCodeText ? (
            <Copy className='size-3' />
          ) : (
            <Check className='size-3 text-green-400 group-hover:text-green-700' />
          )}
        </Button>
      </div>
      <ScrollArea className='flex h-full max-h-[calc(100dvh-160px)] flex-col'>
        <SyntaxHighlighter
          customStyle={{
            borderRadius: '0 0 0.3em 0.3em',
            margin: 0,
            minHeight: '100px',
          }}
          PreTag='div'
          style={oneDark}
          language={language}
        >
          {code}
        </SyntaxHighlighter>
      </ScrollArea>
    </div>
  );
};
