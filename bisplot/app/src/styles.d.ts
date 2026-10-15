// Side-effect stylesheet imports (`import './index.css'`) — checked by default since TypeScript 6.
declare module '*.css';

// Image imports resolve to a URL string. vite-plugin-singlefile inlines them as data: URIs,
// so the built index.html stays self-contained.
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
