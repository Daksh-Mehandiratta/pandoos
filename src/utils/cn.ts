import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes without conflicts.
 * Using tailwind-merge prevents class duplication bugs like
 * "p-4 p-6" where the last one should win.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
