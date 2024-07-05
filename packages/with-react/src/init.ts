if (typeof window !== 'undefined') {
  // @ts-ignore
  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };

  if (import.meta.env.PROD) {
    // Enforce global variables from .env in production here
    // https://vitejs.dev/guide/env-and-mode
    (window as CustomWindow).__API_URL__ = import.meta.env.VITE_API_ENDPOINT;
    (window as CustomWindow).__BASE_URL__ = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, '').replace(/^\/+/, '/');
  }
}
