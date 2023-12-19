  // wallet.ts
  import * as crypto from 'crypto';
  import { Transaction } from './transaction';
  import fs from 'fs';
  import nacl from 'tweetnacl';


  class Wallet {
    public publicKey: any;
    private privateKey: any;
    private amount: number;
    constructor(mnemonic: string, amount: number = 0) {
      const seedBytes = crypto.pbkdf2Sync(mnemonic, "salty", 2048, 32, 'sha256');
      const keyPair = nacl.sign.keyPair.fromSeed(seedBytes);
      this.publicKey = keyPair.publicKey;
      this.privateKey = keyPair.secretKey;
      this.amount = amount;
    }

    static createSeed(wordCount: number = 12): string {
      const ethereumMnemonicWords = fs.readFileSync('./src/english.txt').toString().split('\n');
      if (wordCount !== 12) {
        throw new Error('La cantidad de palabras debe ser 12.');
      }
    
      const seedArray = new Array<string>();
    
      for (let i = 0; i < wordCount; i++) {
        const wordIndex = crypto.randomBytes(2).readUInt16LE(0) % ethereumMnemonicWords.length;
        seedArray.push(ethereumMnemonicWords[wordIndex]);
      }
    
      // Devuelve la semilla como una frase mnemotécnica
      console.log("Frase Semilla: " + seedArray.join(' '));
      return seedArray.join(' ');
    }

    getBalance(): number {
      return this.amount;
    }

    
    
    signTransaction(transaction: Transaction): string {
      const receiverWallet = this;
      const sign = nacl.sign(Buffer.from(
        transaction.fromAddress +
        transaction.toAddress +
        transaction.amount.toString() +
        transaction.nonce.toString()
      ), this.privateKey)
      transaction.signature = sign.toString();
      return transaction.signature;
    }
  }

  export { Wallet };