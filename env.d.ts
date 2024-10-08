/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /* --------------------------------- Examples --------------------------------- */
      NEXT_PUBLIC_BASE_API_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_RPC_URL: string;
      FIREBASE_KEY: string;
      VAULT_PRIVATE_KEY: string;
      NEXT_PUBLIC_VAULT_ADDRESS: string;
      SCRIPT_URL: string;
    }
  }
}

export {};
