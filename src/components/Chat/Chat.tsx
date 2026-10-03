import type { ChatModel } from '../../types/chat';
import type { Message } from '../../types/message';

import MessageInput from './MessageInput';
import MessageList from './MessageList';

import './Chat.css';

interface ChatProps {
  chat: ChatModel;
  messages: Message[];
  messageText: string;
  isSending: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

function Chat({
  chat,
  messages,
  messageText,
  isSending,
  onMessageChange,
  onSendMessage,
}: ChatProps) {
  return (
    <section className='chat'>
      <header className='chat__header'>
        <div className='chat__contact'>
          <h2 className='chat__phone'>{chat.phoneNumber}</h2>
          <span className='chat__status'>MAX</span>
        </div>
      </header>

      <div className='chat__messages'>
        <MessageList messages={messages} />
      </div>

      <div className='chat__input'>
        <MessageInput
          value={messageText}
          isSending={isSending}
          onChange={onMessageChange}
          onSubmit={onSendMessage}
        />
      </div>
    </section>
  );
}

export default Chat;
