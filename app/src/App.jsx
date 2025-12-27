import { useState, useEffect } from 'react';
import { useMessageProgram } from './hooks/useMessageProgram';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [accountPubkey, setAccountPubkey] = useState(localStorage.getItem("msgAccount"));
  const [input, setInput] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState("");
  const { initializeMessage, updateMessage, fetchMessage, loading } = useMessageProgram(window.solana);

  // Reconnect wallet automatically on reload
  useEffect(() => {
    const checkWallet = async () => {
      if (window.solana?.isPhantom) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(resp.publicKey.toString());
        } catch (err) {
          console.log("Wallet not yet authorized");
        }
      }
    };
    checkWallet();
  }, []);

  const connect = async () => {
    try {
      const resp = await window.solana.connect();
      setWalletAddress(resp.publicKey.toString());
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  const handleInit = async () => {
    const pubkey = await initializeMessage(input);
    if (pubkey) {
      const pubkeyStr = pubkey.toBase58();
      setAccountPubkey(pubkeyStr);
      localStorage.setItem("msgAccount", pubkeyStr); // Persist account key
    }
  };

  const handleGetMessage = async () => {
    if (accountPubkey) {
      const msg = await fetchMessage(accountPubkey);
      setFetchedMessage(msg);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Solana Message App</h1>
      
      {!walletAddress ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
          <div>
            <strong>Connected Wallet:</strong> 
            <code style={{ marginLeft: '10px', background: '#757571ff', padding: '2px 5px' }}>{walletAddress}</code>
          </div>

          <input 
            placeholder="Type message here..."
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            style={{ padding: '8px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button disabled={loading} onClick={handleInit}>Initialize</button>
            
            {accountPubkey && (
              <>
                <button disabled={loading} onClick={() => updateMessage(accountPubkey, input)}>
                  Update
                </button>
                <button onClick={handleGetMessage}>Get Message</button>
              </>
            )}
          </div>

          {fetchedMessage && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <strong>On-Chain Message:</strong> {fetchedMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;