/// <reference types="vite/client" />

declare module '*.docx' {
  const src: string;
  export default src;
}

declare module '@/components/DotField';
declare module '@/components/BorderGlow';
