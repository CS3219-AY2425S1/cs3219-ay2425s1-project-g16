import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import type { Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { yCollab } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { extensions as baseExtensions, getLanguage } from '@/lib/editor/extensions';
import { COLLAB_WS } from '@/services/api-clients';

// credit: https://github.com/yjs/y-websocket
const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
];

const getRandomColor = () => {
  return usercolors[Math.floor(Math.random() * usercolors.length)];
};

type IYjsUserState = { user: { name: string; userId: string; color: string; colorLight: string } };

// TODO: Test if collab logic works
export const useCollab = (roomId: string) => {
  const [code, setCode] = useState('');
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [extensions, setExtensions] = useState<Array<Extension>>(baseExtensions);
  const [language, setLanguage] = useState<LanguageName>('python');

  const [members, _setMembers] = useState<Array<IYjsUserState['user']>>([]);
  const setMembers = useCallback(_setMembers, [members]);

  const langExtension = useMemo(() => {
    return getLanguage(language);
  }, [language]);

  useEffect(() => {
    if (editorRef.current) {
      const doc = new Y.Doc();
      let provider = null;
      try {
        provider = new WebsocketProvider(COLLAB_WS, roomId, doc);
        provider.connect();
      } catch (err) {
        const { name, message } = err as Error;
        console.error(
          `An error occurred connecting to the Collab Server: ${JSON.stringify({ name, message })}`
        );
        return;
      }
      const ytext = doc.getText('codemirror');
      const undoManager = new Y.UndoManager(ytext);
      const awareness = provider.awareness;

      provider.on('status', (event: unknown) => {
        const ev = event as { status?: string } | undefined;
        console.log(`Connection Status: ${ev?.status}`);
      });

      awareness.on('update', () => {
        const members = awareness.getStates().values() as MapIterator<IYjsUserState>;
        setMembers(Array.from(members).map((v) => v.user));
      });

      const { color, light } = getRandomColor();
      // TODO: Get user name, ID
      const userState: IYjsUserState['user'] = {
        name: `Anon`,
        userId: '',
        color,
        colorLight: light,
      };
      awareness.setLocalStateField('user', userState);

      const collabExt = yCollab(ytext, awareness, { undoManager });
      setCode(ytext.toString());
      setExtensions([...extensions, collabExt]);
      return () => {
        doc.destroy();
        provider.disconnect();
      };
    }
  }, [editorRef, roomId]);
  return {
    editorRef,
    extensions: [...extensions, langExtension],
    language,
    setLanguage,
    code,
    setCode,
    members,
  };
};
