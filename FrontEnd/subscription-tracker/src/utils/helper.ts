import { format } from "date-fns";

/**
 * Formats a date to the format: '12 April 2015'.
 * @param date - The date as string to format.
 * @returns The formatted date string.
 */
export function formatStringDateToReadable(date: string): string {
    return format(new Date(date), 'd MMMM yyyy');
}

/**
 * Formats a date to the format: '12 April 2015'.
 * @param date - The date as Date object to format.
 * @returns The formatted date string.
 */
export function formatDateToReadable(date: Date): string {
    return format(date, 'd MMMM yyyy');
}

/**
 * Returns an array of currency options with value and label pairs.
 * @returns An array of currency options.
 */
export const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'SGD', label: 'SGD - Singapore Dollar' }
]