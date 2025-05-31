import { format } from "date-fns";

/**
 * Formats a date to the format: '12 April 2015'.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatStringDateToReadable(date: string): string {
    return format(new Date(date), 'd MMMM yyyy');
}