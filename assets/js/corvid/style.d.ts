/***************
 *    Style    *
 **************/
export declare function cssVar(name: string): string;
export declare function render(style: Object): string;
/**
 * Check if the current theme is dark
 */
export declare function isDarkMode(): boolean;
/**
 * Listen for changes in the dark mode preference
 * @param cb - Callback function when theme changes
 */
export declare function onDarkMode(cb: (isDark: boolean) => void): void;
/**
 * Switch between light and dark theme
 * @param theme - 'light' or 'dark'
 */
export declare function switchTheme(theme: string): void;
/**
 * Listen for changes in the dark mode preference
 */
export declare function handleThemeSwitch(): void;
/**
 * Calculate a color gradient
 * @param start - The starting color
 * @param end - The ending color
 * @param value - The value to interpolate between the start and end colors 0 <= value <= 100
 * @return rgb string
 */
export type color = {
    red: number;
    green: number;
    blue: number;
};
export declare function gradient(start: color, end: color, value: number): string;
