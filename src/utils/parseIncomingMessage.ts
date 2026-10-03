import type {
  GreenApiNotification,
} from '../api/types';

import type { Message } from '../types/message';

export function parseIncomingMessage(
  notification: GreenApiNotification,
  chatId: string,
): Message | null {
  const isIncomingText =
    notification.typeWebhook ===
    'incomingMessageReceived' &&
    notification.senderData.chatId === chatId &&
    notification.messageData.typeMessage ===
    'textMessage';

  const message =
    notification.messageData.textMessageData
      ?.textMessage;

  if (!isIncomingText || !message?.trim()) {
    return null;
  }

  return {
    id: notification.idMessage,
    message,
    direction: 'incoming',
  };
}
