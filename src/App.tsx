import { useState } from 'react';
import { createGreenApiClient } from './api/greenApi';
import { createChat } from './services/chatService';
import type { Chat } from './types/chat';

function App() { 
  const [chat, setChat] = useState<Chat | null>(null); 
  const [phone, setPhone] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 
  
  async function handleCreateChat() { 
    setError('');
    setIsLoading(true);

    try { 
      const client = createGreenApiClient(); 
      const state = await client.getStatusInstance(); 
      
      if (state.stateInstance !== 'authorized') { 
        throw new Error( `GREEN-API не авторизован. Текущее состояние: ${state.stateInstance}`, ); 
      } 
      
      const newChat = await createChat(client, phone); setChat(newChat); 
    } catch (error) { 
      setError( error instanceof Error ? error.message : 'Не удалось создать чат.', ); 
    } finally { 
      setIsLoading(false); 
    } 
  } 
  
  return ( 
    <main>
      <h1>MAX Messenger</h1> 
      
      {!chat && ( 
        <section>
          <h2>Новый чат</h2>
          
          <form onSubmit={(event) => { event.preventDefault(); void handleCreateChat(); }} >
            <label htmlFor="phone"> Номер телефона </label>
            <input 
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="79991234567"
              disabled={isLoading} />
            <button 
              type="submit"
              disabled={isLoading || !phone.trim()}
            >  
              {isLoading ? 'Создание...' : 'Создать чат'} 
            </button>
          </form> 
          
          {error && ( 
            <p role="alert"> {error} </p> 
          )} 
        </section> 
      )} 
      
      {chat && ( 
        <section>
          <header>
            <h2>{chat.phoneNumber}</h2>
          </header>

          <div>
            <p>Чат создан</p>
          </div>
        </section> 
      )} 
    </main>
  );
}

export default App;
