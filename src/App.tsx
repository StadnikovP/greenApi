import { useEffect, useState } from 'react';

import {
  createGreenApiClient,
  type GreenApiClient,
} from './api/greenApi';

import Chat from './components/Chat/Chat';
import NewChat from './components/NewChat/NewChat';

import { createChat } from './services/chatService';

import type { ChatModel } from './types/chat';
import type { Message } from './types/message';

import './App.css';

function App() {
  const [client, setClient] = useState<GreenApiClient | null>(null);
  const [chat, setChat] = useState<ChatModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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

      const newChat = await createChat(
        greenApiClient,
        phone,
      );

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
    const chatId = chat.chatId;

    setError('');
    setIsSending(true);

    try {
      const response = await client.sendMessage({
        chatId,
        message,
      });

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: response.idMessage,
          message,
          direction: 'outgoing',
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
            const isIncomingText =
              body.typeWebhook ===
                'incomingMessageReceived' &&
              body.senderData?.chatId === chat?.chatId &&
              body.messageData?.typeMessage ===
                'textMessage';

            const message =
              body.messageData?.textMessageData
                ?.textMessage;

            if (
              isIncomingText &&
              message?.trim()
            ) {
              const messageId =
                body.idMessage ??
                String(receiptId);

              setMessages((previousMessages) => {
                if (
                  previousMessages.some(
                    (message) =>
                      message.id === messageId,
                  )
                ) {
                  return previousMessages;
                }

                return [
                  ...previousMessages,
                  {
                    id: messageId,
                    message,
                    direction: 'incoming',
                  },
                ];
              });
            }
          } finally {
            await client?.deleteNotification(
              receiptId,
            );
          }} catch (error) {
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
  }, [client, chat]);

  return (
    <main className='app'>
      <div className='app__container'>
        <h1 className='app__title'>MAX Messenger</h1>

        {!chat && (
          <NewChat
            phone={phone}
            isLoading={isLoading}
            onPhoneChange={setPhone}
            onSubmit={handleCreateChat}
          />
        )}

        {chat && (
          <Chat
            chat={chat}
            messages={messages}
            messageText={messageText}
            isSending={isSending}
            onMessageChange={setMessageText}
            onSendMessage={handleSendMessage}
          />
        )}

        {error && (
          <p className='app_error' role="alert">
            {error}
          </p>
        )}

      </div>
    </main>
  );
}

export default App;
