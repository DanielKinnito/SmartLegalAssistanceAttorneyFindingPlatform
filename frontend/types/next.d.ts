declare module 'react' {
  export * from 'react';
  export type FC<P = {}> = (props: P) => JSX.Element | null;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export interface ChangeEvent<T = Element> {
    target: T;
  }
  export interface FormEvent<T = Element> {
    preventDefault(): void;
  }
}

declare module 'next/link' {
  import { ComponentProps } from 'react';
  export default function Link(props: ComponentProps<'a'>): JSX.Element;
}

declare module 'next/navigation' {
  export function usePathname(): string;
}

declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
  export default function Image(props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>): JSX.Element;
} 