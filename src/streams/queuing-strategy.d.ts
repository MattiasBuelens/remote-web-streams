export type QueuingStrategySize = (chunk: any) => number;

export interface QueuingStrategy {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize | undefined;
}
