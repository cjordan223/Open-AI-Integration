import React, { useState } from 'react';
import './App.css';

function App() {

  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      console.log('Sending query:', query);
      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Network response was not ok: ${errorData}`);
      }

      const data = await response.json();
      if(data.answer) {
        setAnswer(data.answer);
      } else if (data.error) {
        setAnswer('Error: ' + data.error);
      } 
    } catch (error: any) {
      console.error('Fetch error:', error);
      setAnswer('Error: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <h1> Query Assistant </h1>
        <form onSubmit={handleSubmit}>
          <input 
              type="text"
              placeholder="Enter your question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style = {{ width: '300px', marginRight: '10px' }}
              required              
              />
              <button type='submit' disabled={loading}> 
                {loading ? 'Submitting...': 'Submit'}
              </button>
        </form>

        {answer && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <strong>Answer:</strong>
            <p>{answer}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
