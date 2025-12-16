import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "./idl/solana_message_program.json";

declare global {
  interface Window {
    solana?: any;
  }
}

const NETWORK = "https://api.devnet.solana.com";

export default function App() {
  const getProvider = () => {
    if (!window.solana) {
      throw new Error("Phantom wallet not installed");
    }

    const connection = new Connection(NETWORK, "confirmed");
    return new AnchorProvider(connection, window.solana, {
      commitment: "confirmed",
    });
  };

  const getProgram = () => {
    const provider = getProvider();
    // 🔥 cast to any to silence TS – REQUIRED
    return new Program(idl as any, provider) as any;
  };

  const getPda = () => {
    const provider = getProvider();
    const program = getProgram();

    // PDA seed MUST match Rust (no string seed in your IDL)
    const [pda] = PublicKey.findProgramAddressSync(
      [provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    return pda;
  };

  const connectWallet = async () => {
    await window.solana.connect();
  };

  const initialize = async () => {
    const provider = getProvider();
    const program = getProgram();
    const pda = getPda();

    await program.methods
      .initialize("Hello Solana")
      .accounts({
        messageAccount: pda,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    alert("Initialized");
  };

  const updateMessage = async () => {
    const provider = getProvider();
    const program = getProgram();
    const pda = getPda();

    await program.methods
      .update("Updated from frontend")
      .accounts({
        messageAccount: pda,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    alert("Updated");
  };

  const fetchMessage = async () => {
    const program = getProgram();
    const pda = getPda();

    // 🔥 bracket notation to bypass TS namespace typing
    const account = await program.account["messageAccount"].fetch(pda);
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
