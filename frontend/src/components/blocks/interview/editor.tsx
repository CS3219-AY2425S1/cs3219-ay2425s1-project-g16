import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useWindowSize } from '@uidotdev/usehooks';
import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getTheme, type IEditorTheme, languages, themeOptions } from '@/lib/editor/extensions';
import { useCollab } from '@/lib/hooks/use-collab';

const EXTENSION_HEIGHT = 250;
const MIN_EDITOR_HEIGHT = 350;

type EditorProps = {
  room: string;
};

export const Editor = ({ room }: EditorProps) => {
  const { height } = useWindowSize();
  const [theme, setTheme] = useState<IEditorTheme>('vscodeDark');
  const {
    editorRef,
    extensions,
    language,
    setLanguage,
    code,
    setCode,
    cursorPosition,
    members,
    isLoading,
  } = useCollab(room);
  const themePreset = useMemo(() => {
    return getTheme(theme);
  }, [theme]);

  return (
    <div className='flex flex-col gap-4 p-4'>
      {isLoading ? (
        <div className='flex h-[60px] w-full flex-row justify-between pt-3'>
          <div className='flex h-10 flex-row gap-4'>
            <Skeleton className='h-10 w-16' />
            <Skeleton className='h-10 w-32' />
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Skeleton className='size-10 rounded-full' />
            <Skeleton className='h-8 w-24 rounded-sm' />
          </div>
        </div>
      ) : (
        <div className='flex w-full justify-between gap-4'>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-2'>
              <Label>Language</Label>
              <Select value={language} onValueChange={(val) => setLanguage(val as LanguageName)}>
                <SelectTrigger className='focus-visible:ring-secondary-foreground/60 max-w-[150px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='border-secondary-foreground/30'>
                  {languages.map((lang, idx) => (
                    <SelectItem value={lang} key={idx}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(val) => setTheme(val as IEditorTheme)}>
                <SelectTrigger className='focus-visible:ring-secondary-foreground/60 max-w-[150px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='border-secondary-foreground/30'>
                  {themeOptions.map((theme, idx) => (
                    <SelectItem value={theme} key={idx}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex gap-1 font-mono text-xs'>
              {/* TODO: Get user avatar and display */}
              {members.map((member, index) => (
                <div
                  className='grid size-8 place-items-center !overflow-clip rounded-full border-2 p-1 text-xs'
                  style={{
                    borderColor: member.color,
                  }}
                  key={index}
                >
                  <span className='translate-x-[calc(-50%+12px)]'>{member.userId}</span>
                </div>
              ))}
            </div>
            <Button variant='destructive' size='sm' className='group flex items-center !px-2 !py-1'>
              <ChevronLeftIcon className='transition-transform duration-200 ease-in-out group-hover:-translate-x-px' />
              <span>Disconnect</span>
            </Button>
          </div>
        </div>
      )}
      <div className='border-border w-full !overflow-clip rounded-lg border shadow-sm'>
        <CodeMirror
          ref={editorRef}
          style={{
            fontSize: '14px',
          }}
          height={`${Math.max((height as number) - EXTENSION_HEIGHT, MIN_EDITOR_HEIGHT)}px`}
          value={code}
          onChange={(value, _viewUpdate) => {
            setCode(value);
          }}
          theme={themePreset}
          lang={language}
          basicSetup={{
            tabSize: language === 'python' ? 4 : 2,
            indentOnInput: true,
          }}
          readOnly={isLoading}
          extensions={extensions}
        />
        <div className='bg-secondary text-secondary-foreground z-10 flex w-full translate-y-[-0.5px] border-none py-1 text-xs'>
          <span className='ml-auto mr-2'>
            Ln {cursorPosition.lineNum}, Col {cursorPosition.colNum}
          </span>
        </div>
      </div>
    </div>
  );
};
