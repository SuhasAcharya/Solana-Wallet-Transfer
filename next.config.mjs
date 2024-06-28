/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_SOLANA_WALLET_SECRET_KEY: process.env.NEXT_PUBLIC_SOLANA_WALLET_SECRET_KEY,
    },
  };
  
  export default nextConfig;
  