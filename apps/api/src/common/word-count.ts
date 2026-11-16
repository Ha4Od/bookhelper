
export function countWords(str: string): number {
    const matches = str.trim().split(/\s+/);
    return str.trim() === '' ? 0 : matches.length;
}