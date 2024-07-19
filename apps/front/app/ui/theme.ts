/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

import { darkSelectedIcon, lightSelectedIcon } from '@/app/ui/assets';

export function getStoredTheme(): string | null {
  return localStorage.getItem('theme');
}
export function setStoredTheme(theme: string): void {
  localStorage.setItem('theme', theme);
}

export function getPreferredTheme(): string {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function setTheme(theme: string): void {
  if (theme === 'auto') {
    document.documentElement.setAttribute(
      'data-bs-theme',
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
    );
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}

export function showActiveTheme(theme: string): void {
  const themeSwitcher = document.querySelector<HTMLButtonElement>('#bd-theme');

  if (!themeSwitcher) return;

  const activeThemeIcon = document.querySelector('.theme-icon-active');
  console.log('activeThemeIcon', activeThemeIcon);

  document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
    element.classList.remove('active');
    element.setAttribute('aria-pressed', 'false');
  });

  const lightSvg = lightSelectedIcon;
  const darkSvg = darkSelectedIcon;

  const activeSvg = theme === 'dark' ? darkSvg : lightSvg;

  console.log('activeSvg', activeSvg);

  activeThemeIcon?.setAttribute('src', activeSvg.src);
}
