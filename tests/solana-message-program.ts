import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaMessageProgram } from "../target/types/solana_message_program";
import { expect } from "chai";

describe("solana-message-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaMessageProgram as Program<SolanaMessageProgram>;
  const messageAccount = anchor.web3.Keypair.generate();

  it("Initializes a message", async () => {
    const message = "Hello Solana!";
    
    await program.methods
      .initialize(message)
      .accounts({
        messageAccount: messageAccount.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([messageAccount])
      .rpc();

    const account = await program.account.messageAccount.fetch(messageAccount.publicKey);
    expect(account.message).to.equal(message);
    expect(account.authority.toBase58()).to.equal(provider.wallet.publicKey.toBase58());
  });

  it("Updates the message", async () => {
    const newMessage = "Updated Message!";
    
    await program.methods
      .update(newMessage)
      .accounts({
        messageAccount: messageAccount.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.messageAccount.fetch(messageAccount.publicKey);
    expect(account.message).to.equal(newMessage);
  });
});