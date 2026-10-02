import { useState } from 'react';
import { createGreenApiClient } from './api/greenApi';

function App() {
  const [result, setResult] = useState('');

  async function checkConnection() {
    try {
      const client = createGreenApiClient();
      const state = await client.getStatusInstance();

      setResult(`состояние: ${state.stateInstance}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'неизвестная ошибка');
    }
  }

  return (
    <main>
      <button onClick={checkConnection} >Button</button>

      <p>{result}</p>
    </main>
  );
}

export default App;
