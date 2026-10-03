import './NewChat.css';

interface NewChatProps {
  phone: string;
  isLoading: boolean;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
}

function NewChat({
  phone,
  isLoading,
  onPhoneChange,
  onSubmit,
}: NewChatProps) {
  const textButton = isLoading ? 'Создание...' : 'Создать чат';
  const isDisableButton = isLoading || !phone.trim();

  return (
    <section className="new-chat">
      <div className="new-chat__content">
        <h2 className="new-chat__title">Новый чат</h2>
        <p className="new-chat__description">Введите номер телефона пользователя MAX, чтобы начать переписку.</p>

        <form
        className="new-chat__form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="new-chat__label" htmlFor="phone">
            Номер телефона
          </label>

          <input
            className="new-chat__input"
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="79991234567"
            disabled={isLoading}
          />

          <button
            className="new-chat__button"
            type="submit"
            disabled={isDisableButton}
            aria-label={textButton}
          >
            {textButton}
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewChat;
