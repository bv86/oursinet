import { Locale, S3_BASE_URL } from '@/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type definition
export type ValueElseUndefined<T> = T extends
  | string
  | number
  | boolean
  | symbol
  | object
  ? T
  : undefined;

export function getEnvString<T>(
  key: string,
  defaultValue?: T
): string | ValueElseUndefined<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return process.env[key] || (defaultValue as any);
}

export function getEnvBool(
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}

export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function getFromS3(path: string) {
  return S3_BASE_URL + path;
}

export function getAsset(name: string) {
  return getFromS3(`/assets/${name}`);
}

/**
 * Formats a date according to the browser's locale settings
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(undefined, options);
}

export function localizeLink(locale: Locale, path: string): string {
  if (path.startsWith('http')) return path; // If it's an absolute URL, return it as is

  if (!locale) {
    throw new Error('Locale must be provided for localizing links');
  }

  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // If the locale is already in the path, return it as is
  if (normalizedPath.startsWith(`/${locale}/`)) {
    return normalizedPath;
  }

  // Otherwise, prepend the locale to the path
  return `/${locale}${normalizedPath}`;
}
