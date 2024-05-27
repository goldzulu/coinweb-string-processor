/// <reference types="vite/client" />

declare const __API_URL__: string;

// types/mdx.d.ts
declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string;
  readonly __API_URL__: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
