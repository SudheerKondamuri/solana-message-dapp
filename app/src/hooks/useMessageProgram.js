import { useState } from 'react';
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "../idl/solana_message_program.json";

const NETWORK = "https://api.devnet.solana.com";

export const useMessageProgram = (wallet) => {
    const [loading, setLoading] = useState(false);

    const getProgram = () => {
        if (!wallet) return null;
        const connection = new Connection(NETWORK, "confirmed");
        const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
        return new Program(idl, provider);
    };

    const fetchMessage = async (messageAccountPubkey) => {
        try {
            const program = getProgram();
            if (!program) return null;
            const account = await program.account.messageAccount.fetch(new PublicKey(messageAccountPubkey));
            return account.message;
        } catch (e) {
            console.error("Fetch Error:", e);
            return null;
        }
    };

    const initializeMessage = async (message) => {
        setLoading(true);
        try {
            const program = getProgram();
            const messageAccount = Keypair.generate();
            await program.methods.initialize(message).accounts({
                messageAccount: messageAccount.publicKey,
                authority: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }).signers([messageAccount]).rpc();
            
            setLoading(false);
            return messageAccount.publicKey;
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const updateMessage = async (messageAccountPubkey, newMessage) => {
        setLoading(true);
        try {
            const program = getProgram();
            await program.methods.update(newMessage).accounts({
                messageAccount: new PublicKey(messageAccountPubkey),
                authority: wallet.publicKey,
            }).rpc();
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return { initializeMessage, updateMessage, fetchMessage, loading, getProgram };
};