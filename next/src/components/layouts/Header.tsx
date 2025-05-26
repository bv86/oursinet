import Link from 'next/link';
import { LinkProps, LogoProps } from '@/lib/types';
import { StrapiImage } from '../ui/StrapiImage';
import { LanguageSelector } from '../ui/LanguageSelector';
import { type Locale } from '@/config';
import { localizeLink } from '@/lib/utils';

interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
  };
  locale: Locale;
}

const Header = async ({ data, locale }: HeaderProps) => {
  if (!data) return null;

  const { logo, navigation } = data;
  return (
    <nav className="bg-sidebar text-sidebar-foreground sticky top-0 left-0 z-50 w-full flex justify-between items-center px-2 py-2">
      {/* Left Section with Logo */}
      <section className="flex space-x-4">
        <Link href={`/${locale}`}>
          <StrapiImage
            src={logo.image.url}
            alt={logo.image.alternativeText || 'No alternative text provided'}
            width={40}
            height={40}
          />
        </Link>
      </section>

      {/* Right Section with Navigation and Language Selector */}
      <section className="flex items-center space-x-4">
        {navigation.map((item) => {
          return (
            <Link
              href={localizeLink(locale, item.href)}
              key={item.id}
              className="hover:underline"
              target={item.isExternal ? '_blank' : '_self'}
            >
              <h5>{item.text}</h5>
            </Link>
          );
        })}
        <LanguageSelector currentLocale={locale} />
      </section>
    </nav>
  );
};

export default Header;
