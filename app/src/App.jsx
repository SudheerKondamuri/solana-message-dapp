import { useState } from 'react';
import { useMessageProgram } from './hooks/useMessageProgram';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [accountPubkey, setAccountPubkey] = useState(null);
  const [input, setInput] = useState("");
  const { initializeMessage, updateMessage, loading } = useMessageProgram(window.solana);

  const connect = async () => {
    const resp = await window.solana.connect();
    setWalletAddress(resp.publicKey.toString());
  };

  const handleInit = async () => {
    const pubkey = await initializeMessage(input);
    if (pubkey) setAccountPubkey(pubkey.toBase58());
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Solana Message App</h1>
      {!walletAddress ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button disabled={loading} onClick={handleInit}>Initialize</button>
          {accountPubkey && (
            <button disabled={loading} onClick={() => updateMessage(accountPubkey, input)}>
              Update
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;