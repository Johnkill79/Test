import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/themeStorage";

const SNIPPET = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

/** Applies saved theme before paint to avoid flash (defaults to dark). */
export function ThemeInitScript() {
  return (
    <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: SNIPPET }} />
  );
}
