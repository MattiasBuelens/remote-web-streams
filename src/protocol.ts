export enum SenderType {
  WRITE,
  ABORT,
  CLOSE
}

export enum ReceiverType {
  PULL,
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

export interface PullMessage {
  type: ReceiverType.PULL;
}

export interface ErrorMessage {
  type: ReceiverType.ERROR;
  reason: any;
}

export type SenderMessage = WriteMessage | AbortMessage | CloseMessage;
export type ReceiverMessage = PullMessage | ErrorMessage;
