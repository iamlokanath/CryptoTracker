declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'web-vitals' {
  export type ReportHandler = (metric: {
    name: string;
    delta: number;
    id: string;
  }) => void;
  
  export function getCLS(cb: ReportHandler): void;
  export function getFCP(cb: ReportHandler): void;
  export function getFID(cb: ReportHandler): void;
  export function getLCP(cb: ReportHandler): void;
  export function getTTFB(cb: ReportHandler): void;
} 