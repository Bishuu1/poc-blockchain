import { Blockchain } from "./src/blockchain";
import { Block } from "./src/block";
import { Transaction } from "./src/transaction";
import { Wallet } from "./src/wallet";

async function initBlockchainAndWallet() {
  try {
    // Inicializa la blockchain
    const blockchain = new Blockchain();
    blockchain.addBlock([]);
    // Crea una wallet generando una semilla (12 palabras en este ejemplo)
    const walletSeed = Wallet.createSeed();
    const walletSeed2 = Wallet.createSeed();

    // Crea una wallet a partir de la semilla
    const wallet = new Wallet(walletSeed);
    const wallet2 = new Wallet(walletSeed2);

    // Imprime la clave pública y privada de la wallet
    console.log('Clave pública de la wallet:', wallet.publicKey);
    console.log('Clave pública de la wallet2:', wallet2.publicKey);
    // Ejemplo de creación y firma de una transacción
    const transaction = new Transaction(wallet.publicKey, wallet2.publicKey, 10);
    const transaction2 = new Transaction(wallet2.publicKey, wallet.publicKey, 5);
    const transaction3 = new Transaction(wallet.publicKey, wallet2.publicKey, 2);
    
    // Firma la transacción
    const signature = wallet2.signTransaction(transaction);
    const signature2 = wallet.signTransaction(transaction2);
    const signature3 = wallet2.signTransaction(transaction3);

    // Puedes agregar la transacción a la blockchain y realizar otras operaciones.
    const transactions = [transaction, transaction2, transaction3];
    console.log('Transacción:', transaction, transaction2, transaction3);
    const newBlock = await blockchain.addBlock(transactions);
    console.log('Nuevo bloque:', newBlock);

  } catch (error) {
    console.error('Error al inicializar la blockchain y la wallet:', error);
  }
}

initBlockchainAndWallet();