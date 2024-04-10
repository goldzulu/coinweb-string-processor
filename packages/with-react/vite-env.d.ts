/// <reference types="vite/client" />

declare const __API_URL__: string;

// types/mdx.d.ts
declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}
