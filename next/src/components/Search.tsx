'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';
import { trackEvent } from '@/lib/analytics';
import { Locale } from '@/config';

export function Search({ locale }: { locale: Locale }) {
  // Get access to URL search parameters, routing, and current pathname
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Create a debounced search handler that only triggers 300ms after the user stops typing
  const handleSearch = useDebouncedCallback((term: string) => {
    // Create a new URLSearchParams instance with current params
    const params = new URLSearchParams(searchParams);
    // Reset to first page whenever search term changes
    params.set('page', '1');

    // Update URL search parameters based on search term
    if (term) {
      params.set('query', term);
      // Track search event
      trackEvent('search', {
        action: 'search',
        category: 'user_engagement',
        label: term,
        value: term.length,
      });
    } else {
      params.delete('query');
    }

    // Update the URL without triggering a page refresh
    // scroll: false prevents the page from jumping to top
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="self-stretch">
      <Input
        type="text"
        placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'}
        // Call handleSearch whenever input value changes
        onChange={(e) => handleSearch(e.target.value)}
        // Initialize input with existing search query from URL
        defaultValue={searchParams.get('query')?.toString()}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
      />
    </div>
  );
}
