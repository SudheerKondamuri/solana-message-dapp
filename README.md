Solana Message DApp
This project is a decentralized application (DApp) built on the Solana blockchain using the Anchor Framework. It enables users to store, update, and retrieve custom messages on the blockchain via a React-based web interface.

Project Structure
The repository is organized into the smart contract logic and the frontend application:

programs/solana-message-program: Contains the Rust smart contract (Anchor program).

app: A React frontend built with Vite that interacts with the Solana network.

tests: TypeScript-based testing suite for the smart contract.

Smart Contract (Anchor Program)
The program, identified by the ID 6Jv2T6wLE2Hp53auaVkmDVDyzzM2yRf1ncdLt5ZgqhyA, manages simple data accounts on-chain.

Instructions
initialize: Sets up a new MessageAccount, designates the caller as the authority, and stores the initial message string.

update: Allows the authorized user (matching the authority field) to change the stored message.

Data Account
The MessageAccount struct stores:

authority: The Pubkey of the user allowed to edit the message.

message: A String containing the message content.

Frontend Application
The frontend is a React application that integrates with the Phantom Wallet for transaction signing.

Key Features
Wallet Integration: Connects to the user's Solana wallet and displays the public key.

On-Chain Interactions:

Initialize: Prompts the user to enter a message, generates a new Keypair for the account, and creates it on-chain.

Update: Sends a transaction to modify the message in the existing account.

Fetch: Reads and displays the current message directly from the blockchain.

Network: Configured to interact with the Solana Devnet (https://api.devnet.solana.com).

Prerequisites
To build and run this project, you need:

Rust: v1.89.0

Solana CLI Tools

Anchor Framework: v0.32.1

Node.js: v20 or higher (for the Vite frontend)

Installation and Setup
Build the Program:

Bash

anchor build
Run Tests:

Bash

anchor test
Launch Frontend:

Bash

cd app
npm install
npm run dev
