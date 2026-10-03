import './MessageInput.css';

interface MessageInputProps {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function MessageInput({
  value,
  isSending,
  onChange,
  onSubmit,
}: MessageInputProps) {
  return (
    <form
      className='message-input'
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        className='message-input__input'
        id="message"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Введите сообщение..."
        disabled={isSending}
        aria-label='Сообщение'
      />

      <button
        className='message-input__button'
        type="submit"
        disabled={isSending || !value.trim()}
        aria-label='Отправить сообщение'
      >
        ↑
      </button>
    </form>
  );
}

export default MessageInput;
