function toKebab(str) {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs)=>(ofs ? '-' : '') + s.toLowerCase());
}
function cssVar(name) {
    const style = window.getComputedStyle(document.body);
    return style.getPropertyValue(name);
}
function render(style) {
    let s = '';
    Object.entries(style).forEach(([k, v])=>s += `${toKebab(k)}:${v};`);
    return s;
}
function isDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function onDarkMode(cb) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev)=>{
        cb(ev.matches);
    });
}
function switchTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
function handleThemeSwitch() {
    switchTheme(isDarkMode() ? 'dark' : 'light');
    onDarkMode((dark)=>{
        switchTheme(dark ? 'dark' : 'light');
    });
}
function gradient(start, end, value) {
    value = Math.max(0, Math.min(100, value));
    const red = Math.round(start.red + (end.red - start.red) * value / 100);
    const green = Math.round(start.green + (end.green - start.green) * value / 100);
    const blue = Math.round(start.blue + (end.blue - start.blue) * value / 100);
    return `rgb(${red}, ${green}, ${blue})`;
}
export { cssVar, gradient, handleThemeSwitch, isDarkMode, onDarkMode, render, switchTheme };
