import { EditorView, keymap } from '@codemirror/view';
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap';
import { langs, LanguageName, loadLanguage } from '@uiw/codemirror-extensions-langs';
import * as themes from '@uiw/codemirror-themes-all';
import { Extension } from '@uiw/react-codemirror';

export const languages = [
  'c',
  'cpp',
  'go',
  'haskell',
  'java',
  'javascript',
  'jsx',
  'kotlin',
  'python',
  'rust',
  'typescript',
  'tsx',
] as LanguageName[];

const loaded: Record<string, boolean> = {};
const langExtensions = Object.fromEntries(languages.map((v) => [v, langs[v]()]));

export const getLanguage = (language: (typeof languages)[number]) => {
  if (!loaded[language]) {
    loadLanguage(language);
    loaded[language] = true;
  }

  return langExtensions[language];
};

export const themeOptions = [
  'abcdef',
  'abyss',
  'androidstudio',
  'andromeda',
  'atomone',
  'aura',
  'basic',
  'bbedit',
  'bespin',
  'copilot',
  'darcula',
  'dracula',
  'duotone',
  'eclipse',
  'github',
  'githubDark',
  'gruvbox',
  'gruvboxDark',
  'kimbie',
  'material',
  'monokai',
  'monokaiDimmed',
  'noctisLilac',
  'nord',
  'okaidia',
  'quietlight',
  'red',
  'solarized',
  'sublime',
  'tokyoNight',
  'tokyoNightStorm',
  'tokyoNightDay',
  'tomorrowNightBlue',
  'vscode',
  'vscodeDark',
  'white',
  'xcode',
] as const;

export type IEditorTheme = (typeof themeOptions)[number];

export const getTheme = (theme: IEditorTheme) => {
  return themes[theme as keyof typeof themes] as Extension;
};

export const extensions = [keymap.of(vscodeKeymap), EditorView.lineWrapping];
