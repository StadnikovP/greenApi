export type MessageDirection = 'incoming' | 'outgoing';

export interface Message {
  id: string;
  message: string;
  direction: MessageDirection;
}
