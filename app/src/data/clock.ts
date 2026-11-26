// The app's clock. In a test build only, a hidden control can set the date and time and jump to a story's start
// (build-skeleton §4). It is compiled out of the production build: `import.meta.env.VITE_TEST_CONTROLS` is false there.
let offset = 0;
export const now = () => new Date(Date.now() + offset);
export const TEST_CONTROLS = import.meta.env.VITE_TEST_CONTROLS === 'true';
export function setNow(d: Date) { if (TEST_CONTROLS) offset = d.getTime() - Date.now(); }
