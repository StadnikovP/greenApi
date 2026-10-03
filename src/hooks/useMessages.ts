import { useEffect } from 'react';

import type { GreenApiClient } from '../api/greenApi';
import type { Message } from '../types/message';

import { parseIncomingMessage } from '../utils/parseIncomingMessage';

interface UseMessagesParams {
  client: GreenApiClient | null;
  chatId: string | null;
  onMessage: (message: Message) => void;
}

function useMessages({
  client,
  chatId,
  onMessage,
}: UseMessagesParams) {
  useEffect(() => {
    if (!client || !chatId) {
      return;
    }

    let isActive = true;
    const currentChatId = chatId;

    async function receiveMessages() {
      while (isActive) {
        try {
          const notification =
            await client?.receiveNotification(5);

          if (!isActive) {
            break;
          }

          if (!notification) {
            continue;
          }

          const { receiptId, body } = notification;

          try {
            const message = parseIncomingMessage(body, currentChatId);

            if (message) {
              onMessage(message);
            }
          } finally {
            await client?.deleteNotification(
              receiptId,
            );
          }
        } catch (error) {
          if (!isActive) {
            break;
          }

          console.error(
            'Ошибка получения сообщения:',
            error,
          );

          await new Promise((resolve) =>
            setTimeout(resolve, 1500),
          );
        }
      }
    }

    void receiveMessages();

    return () => {
      isActive = false;
    };
  }, [client, chatId, onMessage]);
}

export default useMessages;
