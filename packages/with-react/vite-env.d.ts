/// <reference types="vite/client" />

// types/mdx.d.ts
declare module '*.mdx' {
  let MDXComponent: (props: unknown) => JSX.Element;
  export default MDXComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_EXPLORER_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface CustomWindow extends Window {
  __API_URL__?: string;
  __BASE_URL__?: string;
  __EXPLORER_URL__?: string;
}
