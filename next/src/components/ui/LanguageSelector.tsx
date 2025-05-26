'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/config';

interface LanguageSelectorProps {
  currentLocale: Locale;
}

const languageNames = {
  en: 'English',
  fr: 'Français',
} as const;

const languageFlags = {
  en: '🇺🇸',
  fr: '🇫🇷',
} as const;

export const LanguageSelector = ({ currentLocale }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    // Set cookie to remember user's language preference
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPath = `/${locale}${pathWithoutLocale}`;

    router.push(newPath);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyboardToggle = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyboardToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className="text-lg"
          role="img"
          aria-label={`Flag of ${languageNames[currentLocale]}`}
        >
          {languageFlags[currentLocale]}
        </span>
        <span className="text-sm font-medium">
          {languageNames[currentLocale]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 bg-sidebar border border-sidebar-border rounded-md shadow-lg z-50 min-w-[150px]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus:outline-none focus:bg-sidebar-accent focus:text-sidebar-accent-foreground ${
                locale === currentLocale
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : ''
              }`}
              role="menuitem"
              aria-current={locale === currentLocale ? 'true' : 'false'}
            >
              <span
                className="text-lg"
                role="img"
                aria-label={`Flag of ${languageNames[locale]}`}
              >
                {languageFlags[locale]}
              </span>
              <span className="text-sm">{languageNames[locale]}</span>
              {locale === currentLocale && (
                <span className="ml-auto text-xs opacity-75">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
