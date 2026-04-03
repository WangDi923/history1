declare module "opencc-js" {
  export type ConvertDirection = "cn" | "tw" | "twp" | "hk" | "jp";

  export interface ConverterOptions {
    from: ConvertDirection;
    to: ConvertDirection;
  }

  export function Converter(options: ConverterOptions): (input: string) => string;
}
