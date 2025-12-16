import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "./idl/solana_message_program.json";

const NETWORK = "https://api.devnet.solana.com";

function App() {
  const getProvider = () => {
    if (!window.solana) throw new Error("Install Phantom");
    const connection = new Connection(NETWORK, "confirmed");
    return new AnchorProvider(connection, window.solana, {
      commitment: "confirmed",
    });
  };

  const getProgram = () => {
    const provider = getProvider();
    return new Program(idl, provider);
  };

  const connectWallet = async () => {
    await window.solana.connect();
  };

  const initialize = async () => {
    const provider = getProvider();
    const program = getProgram();

    // 🔴 THIS IS THE KEY FIX
    const messageAccount = Keypair.generate();

    await program.methods
      .initialize("Hello Solana")
      .accounts({
        messageAccount: messageAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .signers([messageAccount]) // 👈 REQUIRED
      .rpc();

    // store pubkey so we can reuse it
    localStorage.setItem(
      "messageAccount",
      messageAccount.publicKey.toBase58()
    );

    alert("Initialized");
  };

  const updateMessage = async () => {
    const provider = getProvider();
    const program = getProgram();

    const messagePubkey = localStorage.getItem("messageAccount");
    if (!messagePubkey) {
      alert("Initialize first");
      return;
    }

    await program.methods
      .update("Updated from frontend")
      .accounts({
        messageAccount: new PublicKey(messagePubkey),
        authority: provider.wallet.publicKey,
      })
      .rpc();

    alert("Updated");
  };

  const fetchMessage = async () => {
    const program = getProgram();

    const messagePubkey = localStorage.getItem("messageAccount");
    if (!messagePubkey) {
      alert("Initialize first");
      return;
    }

    const account = await program.account.messageAccount.fetch(
      new PublicKey(messagePubkey)
    );

    alert(account.message);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Solana Message DApp</h2>

      <button onClick={connectWallet}>Connect Wallet</button>
      <br /><br />

      <button onClick={initialize}>Initialize</button>
      <br /><br />

      <button onClick={updateMessage}>Update Message</button>
      <br /><br />

      <button onClick={fetchMessage}>Fetch Message</button>
    </div>
  );
}

export default App;
