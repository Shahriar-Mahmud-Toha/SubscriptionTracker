/**
 * Utility function to create a delay/timeout using Promise
 * @param ms - The number of milliseconds to delay
 * @returns A Promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}; 