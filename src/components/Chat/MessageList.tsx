import type { Message } from '../../types/message';

import './MessageList.css';

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className='message-list' aria-live="polite">
        <p className='message-list__empty'>Сообщений пока нет</p>
      </div>
    );
  }

  return (
    <ol className='message-list' role="loge" aria-label='Сообщение чата' aria-live="polite">
      {messages.map((item) => (
        <li
          key={item.id}
          className={`message message--${item.direction}`}
        >
          <article>
            <span className='visibility-hidden'>
              {item.direction === 'incoming' ? 'Входящее сообщение' : 'Исходящее сообщение'}
            </span>
            <div className="message__text">
              {item.message}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

export default MessageList;
