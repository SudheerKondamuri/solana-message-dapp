import { useState, useEffect } from "react";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "./idl/solana_message_program.json";

const NETWORK = "https://api.devnet.solana.com";
const opts = { commitment: "confirmed" };

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userInput, setUserInput] = useState(""); // New state for user-defined message

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { solana } = window;
        if (solana?.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        }
      } catch (error) {
        console.error("Connection check failed", error);
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const getProvider = () => {
    if (!window.solana) throw new Error("Install Phantom Wallet");
    const connection = new Connection(NETWORK, opts.commitment);
    return new AnchorProvider(connection, window.solana, opts);
  };

  const getProgram = () => {
    const provider = getProvider();
    return new Program(idl, provider);
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  const initialize = async () => {
    if (!userInput) return alert("Please enter a message first!");
    try {
      const provider = getProvider();
      const program = getProgram();
      const messageAccount = Keypair.generate();

      console.log("Initializing with message:", userInput);
      await program.methods
        .initialize(userInput) // Uses user input
        .accounts({
          messageAccount: messageAccount.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([messageAccount])
        .rpc();

      localStorage.setItem("messageAccount", messageAccount.publicKey.toBase58());
      setUserInput(""); // Clear input
      alert("Success: Account Initialized!");
    } catch (err) {
      console.error("Initialize Error:", err);
      alert("Initialization Failed: " + err.message);
    }
  };

  const updateMessage = async () => {
    if (!userInput) return alert("Please enter a new message first!");
    try {
      const provider = getProvider();
      const program = getProgram();
      const messagePubkey = localStorage.getItem("messageAccount");

      if (!messagePubkey) throw new Error("Initialize first!");

      await program.methods
        .update(userInput) // Uses user input
        .accounts({
          messageAccount: new PublicKey(messagePubkey),
          authority: provider.wallet.publicKey,
        })
        .rpc();

      setUserInput(""); // Clear input
      alert("Success: Message Updated!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update Failed: " + err.message);
    }
  };

  const fetchMessage = async () => {
    try {
      const program = getProgram();
      const messagePubkey = localStorage.getItem("messageAccount");

      if (!messagePubkey) throw new Error("Initialize first!");

      const account = await program.account.messageAccount.fetch(
        new PublicKey(messagePubkey)
      );

      setCurrentMessage(account.message);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Fetch Failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Solana Message DApp</h2>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</p>
          
          <div style={{ marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="Enter message here..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              style={{ padding: "10px", width: "250px", marginRight: "10px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <button onClick={initialize}>1. Initialize with My Message</button>
            <button onClick={updateMessage}>2. Update to My Message</button>
            <button onClick={fetchMessage}>3. Refresh/Fetch Message</button>
          </div>

          {currentMessage && (
            <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ccc" }}>
              <b>Current Message on Blockchain:</b>
              <p style={{ fontSize: "1.2em", color: "#646cff" }}>{currentMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;