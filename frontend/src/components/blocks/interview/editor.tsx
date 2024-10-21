import { useWindowSize } from '@uidotdev/usehooks';
import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo, useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTheme, type IEditorTheme, languages, themeOptions } from '@/lib/editor/extensions';
import { useCollab } from '@/lib/hooks/use-collab';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

const EXTENSION_HEIGHT = 250;
const MIN_EDITOR_HEIGHT = 350;

type EditorProps = {
  room: string;
};

export const Editor = ({ room }: EditorProps) => {
  const { height } = useWindowSize();
  const [theme, setTheme] = useState<IEditorTheme>('vscodeDark');
  const { editorRef, extensions, language, setLanguage, code, setCode, members } = useCollab(room);
  const themePreset = useMemo(() => {
    return getTheme(theme);
  }, [theme]);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex w-full justify-between gap-4'>
        <div className='flex gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Language</Label>
            <Select value={language} onValueChange={(val) => setLanguage(val as LanguageName)}>
              <SelectTrigger className='max-w-[150px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className='max-w-[150px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                className='grid size-8 place-items-center !overflow-clip rounded-full border p-1 text-xs'
                style={{
                  borderColor: member.color,
                }}
                key={index}
              >
                <span className='translate-x-[calc(-50%+12px)]'>{member.name}</span>
              </div>
            ))}
          </div>
          <Button variant='destructive' size='sm' className='group flex items-center !px-2 !py-1'>
            <ChevronLeftIcon className='transition-transform duration-200 ease-in-out group-hover:-translate-x-px' />
            <span>Disconnect</span>
          </Button>
        </div>
      </div>
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
          extensions={extensions}
        />
      </div>
    </div>
  );
};
