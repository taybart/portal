/**
 * Converts bytes to a human-readable string representation
 *
 * @param bytes - The number of bytes to convert
 * @param options - Optional configuration
 * @param options.useSI - If true, use SI units (KB, MB, GB) with powers of 1000
 *                                 If false, use binary units (KiB, MiB, GiB) with powers of 1024
 * @param options.decimals - Number of decimal places to include (default: 2)
 * @return Human-readable representation (e.g., "4.2 MB" or "3.7 GiB")
 */
export type bytesOptions = {
    useSI?: boolean;
    decimals?: number;
    includeUnits?: boolean;
    targetUnit?: string;
};
export declare function bytesToHuman(bytes: string, options?: bytesOptions): string;
export declare function toKebab(str: string): string;
