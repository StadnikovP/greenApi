import { useEffect, useState } from 'react';

import {
  createGreenApiClient,
  type GreenApiClient,
} from './api/greenApi';

import { createChat } from './services/chatService';
import type { Chat } from './types/chat';

interface SentMessage {
  id: string;
  message: string;
  direction: 'incoming' | 'outgoing';
}

function App() {
  const [client, setClient] = useState<GreenApiClient | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<SentMessage[]>([]);

  const [phone, setPhone] = useState('');
  const [messageText, setMessageText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateChat() {
    setError('');
    setIsLoading(true);

    try {
      const greenApiClient = createGreenApiClient();

      const state = await greenApiClient.getStatusInstance();

      if (state.stateInstance !== 'authorized') {
        throw new Error(
          `GREEN-API не авторизован. Текущее состояние: ${state.stateInstance}`,
        );
      }

      const newChat = await createChat(greenApiClient, phone);

      setClient(greenApiClient);
      setChat(newChat);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось создать чат.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!client || !chat || !messageText.trim()) {
      return;
    }

    const message = messageText.trim();

    setError('');
    setIsSending(true);
    const chatId = chat.chatId;

    try {
      const response = await client.sendMessage({chatId, message});

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: response.idMessage,
          message,
          direction: 'outgoing'
        },
      ]);

      setMessageText('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить сообщение.',
      );
    } finally {
      setIsSending(false);
    }
  }

  useEffect(() => {
    if (!client || !chat) {
      return;
    }

    let isActive = true;

    async function receiveMessages() {
      while (isActive) {
        try {
          const notification = await client!.receiveNotification(5);

          if (!isActive) {
            break;
          }

          if (!notification) {
            continue;
          }

          const { receiptId, body } = notification;

          try {
            const isIncomingText =
              body.typeWebhook === 'incomingMessageReceived' &&
              body.senderData?.chatId === chat!.chatId &&
              body.messageData?.typeMessage === 'textMessage';

            const message =
              body.messageData?.textMessageData?.textMessage;

            if (isIncomingText && message?.trim()) {
              const messageId = body.idMessage ?? String(receiptId);

              setMessages((previousMessages) => {
                if (
                  previousMessages.some(
                    (message) => message.id === messageId,
                  )
                ) {
                  return previousMessages;
                }

                return [
                  ...previousMessages,
                  {
                    id: messageId,
                    message,
                    direction: 'incoming'
                  },
                ];
              });
            }
          } finally {
            await client!.deleteNotification(receiptId);
          }
        } catch (error) {
          if (!isActive) {
            break;
          }

          console.error('Ошибка получения сообщения:', error);

          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    void receiveMessages();

    return () => {
      isActive = false;
    };

  }, [client, chat]);

  return (
    <main>
      <h1>MAX Messenger</h1>

      {!chat && (
        <section>
          <h2>Новый чат</h2>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleCreateChat();
            }}
          >
            <label htmlFor="phone">Номер телефона</label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="79991234567"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !phone.trim()}
            >
              {isLoading ? 'Создание...' : 'Создать чат'}
            </button>
          </form>
        </section>
      )}

      {chat && (
        <section>
          <header>
            <h2>{chat.phoneNumber}</h2>
          </header>

          <div aria-live="polite">
            {messages.length === 0 ? (
              <p>Сообщений пока нет</p>
            ) : (
              messages.map((item) => (
                <div key={item.id} className={`message message--${item.direction}`}>
                  <div className='message__text'>
                    {item.message}
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendMessage();
            }}
          >
            <label htmlFor="message">Сообщение</label>

            <input
              id="message"
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Введите сообщение..."
              disabled={isSending}
            />

            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
            >{isSending ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </section>
      )}

      {error && <p role="alert">{error}</p>}
    </main>
  );
}

export default App;
