if (typeof window !== 'undefined') {
  if (import.meta.env.PROD) {
    // Enforce global variables from .env in production here
    // https://vitejs.dev/guide/env-and-mode
    (window as any).__API_URL__ = import.meta.env.VITE_API_ENDPOINT;
  }
}
