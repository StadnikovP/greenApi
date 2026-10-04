import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  createGreenApiClient,
  type GreenApiClient,
} from './api/greenApi';

import type { GreenApiCredentials } from './api/types';

import Chat from './components/Chat/Chat';
import GreenApiCredentialsForm from './components/GreenApiCredentials/GreenApiCredentialsForm.tsx';
import NewChat from './components/NewChat/NewChat';

import { getEnvCredentials } from './config/greenApiConfig';

import { createChat } from './services/chatService';

import type { ChatModel } from './types/chat';
import type { Message } from './types/message';

import './App.css';
import useMessages from './hooks/useMessages';

function App() {
  const [credentials, setCredentials] =
    useState<GreenApiCredentials | null>(
      getEnvCredentials(),
    );

  const [chat, setChat] =
    useState<ChatModel | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [phone, setPhone] = useState('');
  const [messageText, setMessageText] = useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [error, setError] = useState('');

  const client = useMemo<GreenApiClient | null>(() => {
    if (!credentials) {
      return null;
    }

    return createGreenApiClient(credentials);
  }, [credentials]);

  async function handleCreateChat() {
    if (!client) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const state =
        await client.getStatusInstance();

      if (
        state.stateInstance !== 'authorized'
      ) {
        throw new Error(
          `GREEN-API не авторизован. Текущее состояние: ${state.stateInstance}`,
        );
      }

      const newChat = await createChat(
        client,
        phone,
      );

      setChat(newChat);
      setMessages([]);
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
    if (
      !client ||
      !chat ||
      !messageText.trim()
    ) {
      return;
    }

    const message = messageText.trim();
    const chatId = chat.chatId;

    setError('');
    setIsSending(true);

    try {
      const response =
        await client.sendMessage({
          chatId,
          message,
        });

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          {
            id: response.idMessage,
            message,
            direction: 'outgoing',
          },
        ],
      );

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

  const handleIncomingMessage =
    useCallback((message: Message) => {
      setMessages((previousMessages) => {
        if (
          previousMessages.some(
            (item) => item.id === message.id,
          )
        ) {
          return previousMessages;
        }

        return [
          ...previousMessages,
          message,
        ];
      });
    }, []);

  useMessages({
    client,
    chatId: chat?.chatId ?? null,
    onMessage: handleIncomingMessage,
  });

  function handleCredentialsSubmit(
    newCredentials: GreenApiCredentials,
  ) {
    setCredentials(newCredentials);
    setError('');
  }

  if (!credentials) {
    return (
      <main className='app'>
        <div className='app__container'>
          <h1 className='app__title'>
            MAX Messenger
          </h1>

          <GreenApiCredentialsForm
            onSubmit={handleCredentialsSubmit}
          />
        </div>
      </main>
    );
  }

  return (
    <main className='app'>
      <div className='app__container'>
        <h1 className='app__title'>
          MAX Messenger
        </h1>
        
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
          <p
            className='app_error'
            role='alert'
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

export default App;
