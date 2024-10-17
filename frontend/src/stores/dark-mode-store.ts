import { makeAutoObservable } from 'mobx';

class DarkModeStore {
  mode = 'light';

  constructor() {
    makeAutoObservable(this);
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    this.mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  toggle = (value: string) => {
    this.mode = value;
    const { documentElement } = document;

    if (value === 'light') {
      documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
}

export const darkModeStore = new DarkModeStore();
