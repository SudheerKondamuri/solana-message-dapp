# Solana Message DApp

## Introduction

Solana Message DApp is a decentralized application (DApp) built on the **Solana blockchain** using the **Anchor Framework**. It allows users to initialize a data account with a custom message, update that message, and fetch it directly from the blockchain through a **React-based web interface**.

---

## 📂 Project Structure

The repository is divided into the smart contract (program) and the frontend application:

```text
programs/
 └── solana-message-program/   # Rust smart contract logic (Anchor program)

app/                           # React frontend built with Vite

tests/                         # TypeScript-based testing suite
```

---

## 🦀 Smart Contract (Anchor Program)

The smart contract manages `MessageAccount` structures on-chain.

- **Program ID:**  
  `6Jv2T6wLE2Hp53auaVkmDVDyzzM2yRf1ncdLt5ZgqhyA`

### Data Account Structure

The `MessageAccount` stores the following fields:

- `authority` — `Pubkey` of the user authorized to modify the message
- `message` — `String` containing the message content

### Instructions

- **initialize**
  - Creates a new `MessageAccount`
  - Sets the caller as the authority
  - Stores the initial message

- **update**
  - Allows only the authorized user
  - Updates the stored message

---

## 💻 Frontend Application

The frontend is a **React** application built with **Vite** and integrated with **Phantom Wallet** for wallet connectivity and transaction signing.

### Key Features

- **Wallet Integration**
  - Connects to the user's Solana wallet
  - Displays the connected public key

- **On-Chain Interactions**
  - **Initialize**
    - Prompts the user for a message
    - Generates a new account on-chain
  - **Update**
    - Updates the message in an existing account
  - **Fetch**
    - Reads the current message directly from the blockchain

- **Network**
  - Solana Devnet
  - RPC Endpoint: https://api.devnet.solana.com

---

## 🚀 Getting Started

### Prerequisites

- Rust: v1.89.0
- Solana CLI Tools
- Anchor Framework: v0.32.1
- Node.js: v20 or higher

---

## 📦 Installation and Setup

### Clone the Repository

```bash
git clone <repository-url>
cd solana-message-dapp
```

### Build and Test the Program

```bash
anchor build
anchor test
```

### Launch the Frontend

```bash
cd app
npm install
npm run dev
```

---

## 🛠 Configuration

- **Anchor.toml**
  - Configured for localnet by default
  - Frontend is configured for devnet

### Dependencies

**Backend**
- anchor-lang v0.32.1

**Frontend**
- react v19.2.0
- @coral-xyz/anchor v0.32.1
- @solana/web3.js v1.98.4
