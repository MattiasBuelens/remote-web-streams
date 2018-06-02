export const enum SenderType {
  WRITE,
  ABORT,
  CLOSE
}

export const enum ReceiverType {
  BACKPRESSURE,
  ERROR
}

export interface WriteMessage {
  type: SenderType.WRITE;
  chunk: any;
}

export interface AbortMessage {
  type: SenderType.ABORT;
  reason: any;
}

export interface CloseMessage {
  type: SenderType.CLOSE;
}

export interface BackpressureMessage {
  type: ReceiverType.BACKPRESSURE;
  backpressure: boolean;
}

export interface ErrorMessage {
  type: ReceiverType.ERROR;
  reason: any;
}

export type SenderMessage = WriteMessage | AbortMessage | CloseMessage;
export type ReceiverMessage = BackpressureMessage | ErrorMessage;
