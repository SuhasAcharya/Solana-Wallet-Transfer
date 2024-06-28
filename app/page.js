"use client"
import { useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

export default function Home() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null); 

  const handleSend = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const secretKey = Uint8Array.from(
        JSON.parse(process.env.NEXT_PUBLIC_SOLANA_WALLET_SECRET_KEY)
      );
      
      if (secretKey.length !== 64) {
        throw new Error("Invalid secret key length");
      }

      const fromWallet = Keypair.fromSecretKey(secretKey);

      if (!PublicKey.isOnCurve(address)) {
        throw new Error("Invalid Solana wallet address");
      }

      const toWallet = new PublicKey(address);
      const amountInLamports = amount * LAMPORTS_PER_SOL;

      if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      const balance = await connection.getBalance(fromWallet.publicKey);
      if (balance < amountInLamports) {
        throw new Error("Insufficient funds in the sender's wallet");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: toWallet,
          lamports: amountInLamports,
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
      );

      setTransactionHash(signature); 
      alert(`Transaction successful with signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
      alert(`Transaction failed: ${error.message}`);
    }
  };


  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 gap-y-20">
      <div className="space-y-4">
        <h1 className="text-gray-400 text-4xl font-bold">Solana Wallet Transfer</h1>
      </div>

      <div className="h-[50%] w-[50%] rounded-lg flex flex-col justify-center items-center gap-y-10 bg-gray-800 border-2 border-gray-700">
        <div className="flex flex-col gap-y-10">
          <input
            type="text"
            placeholder="Solana Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input input-bordered w-[40vw] bg-gray-800 border-gray-700 text-gray-400 placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="Solana Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-[40vw] bg-gray-800 border-gray-700 text-gray-400 placeholder-gray-400"
          />
        </div>

        <button onClick={handleSend} className="btn btn-wide bg-blue-500 text-white">
          Send
        </button>
      </div>

      {transactionHash && (
        <div className="mt-4 text-gray-400">
            <h6 className="text-2xl text-green-800 mb-3">Transaction Completed 🎉</h6>
          Transaction Hash: {transactionHash}
        </div>
      )}
    </div>
  );
}
