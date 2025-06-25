declare module "class-variance-authority" {
  export function cva(base: string, config?: any): any
  export type VariantProps<T> = any
}

declare module "clsx" {
  export default function clsx(...args: any[]): string
  export type ClassValue = any
}

declare module "tailwind-merge" {
  export function twMerge(...args: string[]): string
}
