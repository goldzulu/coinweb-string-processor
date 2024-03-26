import './App.css';
import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import coinwebLogo from './assets/coinweb-logo.svg';

import { useGreeting } from './hooks';

interface FormState {
  firstKey: number | string;
  secondKey: number | string;
  body: string;
}

function App() {
  const [form, setForm] = useState<FormState>();

  const { fetch, greeting, contractId, isLoading } = useGreeting();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (greeting) {
      setForm({
        firstKey: greeting?.firstKey,
        secondKey: greeting?.secondKey,
        body: greeting?.body,
      });
    }
  }, [greeting]);

  const onClaimFieldChangeHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((state) => {
      if (state) {
        return { ...state, [field]: Number(value) || value };
      }
    });
  };

  return (
    <>
      <header>
        <a href="https://coinweb.io" target="_blank">
          <img src={coinwebLogo} className="logo coinweb" alt="Coinweb logo" />
        </a>
        <span>{' x '}</span>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </header>
      <main>
        <h1>Hello World</h1>
        <h2>Contract ID</h2>
        <p>{contractId}</p>

        <br />

        {isLoading ? (
          <div className="loader" />
        ) : (
          form && (
            <div className="claim">
              <form className="claim-form">
                <div className="input-wrapper">
                  <input value={form.firstKey} onChange={onClaimFieldChangeHandler('keyFirstPart')} />
                  <span className="input-label">First key</span>
                </div>
                <div className="input-wrapper">
                  <input value={form.secondKey} onChange={onClaimFieldChangeHandler('keySecondPart')} />
                  <span className="input-label">Second key</span>
                </div>
                <div className="input-wrapper">
                  <input value={form.body} onChange={onClaimFieldChangeHandler('claimBody')} />
                  <span className="input-label">Claim body</span>
                </div>
              </form>
            </div>
          )
        )}
      </main>
      <footer>© {new Date().getFullYear()} Coinweb — True Interoperability. Real world usage.</footer>
    </>
  );
}

export default App;
