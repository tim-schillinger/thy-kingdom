// Alpha artifact build: no service worker (the viewer refuses them). Production uses virtual:pwa-register.
export function registerSW(_opts?: unknown) { return () => Promise.resolve(); }
