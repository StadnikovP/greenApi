import { useState } from 'react';
import type { GreenApiCredentials } from '../../api/types';
import './GreenApiCredentialsForm.css';

interface GreenApiCredentialsFormProps {
  onSubmit: (credentials: GreenApiCredentials) => void;
}

function GreenApiCredentialsForm({
  onSubmit,
}: GreenApiCredentialsFormProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] =
    useState('');

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onSubmit({
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  }

  return (
    <section className='credentials'>
      <header className='credentials__header'>
        <h2 className='credentials__title'>Подключение GREEN-API</h2>
        <p className='credentials__description'>Введите данные вашего инстанса GREEN-API чтобы начать работу с MAX</p>
      </header>

      <form className='credentials__form' onSubmit={handleSubmit}>
        <div className='credentials__field'>
          <label className='credentials__label' htmlFor="api-url">
            GREEN-API URL
          </label>

          <input
            className='credentials__input'
            id="api-url"
            type="url"
            value={apiUrl}
            onChange={(event) =>
              setApiUrl(event.target.value)
            }
            placeholder="https://7103.api.greenapi.com"
            required
          />
        </div>

        <div className='credentials__field'>
          <label className='credentials__label' htmlFor="id-instance">
            ID Instance
          </label>

          <input
            className='credentials__input'
            id="id-instance"
            type="text"
            value={idInstance}
            onChange={(event) =>
              setIdInstance(event.target.value)
            }
            required
          />
        </div>

        <div className='credentials__field'>
          <label className='credentials__label' htmlFor="api-token">
            API Token Instance
          </label>

          <input
            className='credentials__input'
            id="api-token"
            type="password"
            value={apiTokenInstance}
            onChange={(event) =>
              setApiTokenInstance(event.target.value)
            }
            required
          />
        </div>

        <button className='credentials__submit' type="submit">
          Подключиться
        </button>
      </form>
    </section>
  );
}

export default GreenApiCredentialsForm;
