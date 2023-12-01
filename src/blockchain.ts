import { Block } from "./block";
import { Transaction } from "./transaction";
import { Level } from "level";

class Blockchain {  
    private chain: any;
    private height: number;
    private pendingTransactions: Transaction[];

    constructor() {
        this.chain = new Level('./db', { valueEncoding: 'json' });
        this.height = -1;
        this.pendingTransactions = [];
        this.initializeChain();
    }

    private async initializeChain(): Promise<void> {
        try {
            const lastBlock = await this.getLastBlock();
            if (lastBlock) {
                this.height = lastBlock.index;
            } else {
                // No hay bloques en la cadena, crear bloque génesis
                const genesisBlock = this.createGenesisBlock();
                await this.chain.put(0, genesisBlock);
                this.height = 0;
            }
        } catch (error) {
            console.error("Error al inicializar la cadena de bloques:", error);
        }
    }


    private createGenesisBlock(): any { 
        if (this.height != -1) {
            throw new Error("Genesis block already created");
        }
        const hash = Block.calculateHash(0, null, Date.now(), []);
        return new Block(0, null, Date.now(), [], hash);
    }

    private async getLastBlock(): Promise<Block | null> {
        try {
            let lastBlock = null;
            for await (const [key, value] of this.chain.iterator({ reverse: true, limit: 1 })) {
                lastBlock = value;
            }
            return lastBlock;
        } catch (error) {
            console.error("Error al obtener el último bloque:", error);
            return null;
        }
    }

    addTransaction(transaction: Transaction): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!(await transaction.isValid())) {
                reject(new Error("Cannot add invalid transaction to chain"));
            }
            this.pendingTransactions.push(transaction);
            resolve();
        });
    }
    addBlock(): Promise<Block> {
        return new Promise(async (resolve, reject) => {
            if (this.height < 0) {
                const gen = this.createGenesisBlock()
                await this.chain.put(0, gen); //revisar
                this.height++;
                resolve(this.chain.get(0));
            }else {
                const index = this.height + 1;
                const previousHash = (await this.chain.get(this.height)).hash;
                const timestamp = Date.now();
                const hash = Block.calculateHash(index, previousHash, timestamp, this.pendingTransactions);
                
                const newBlock = new Block(
                    index,
                    previousHash,
                    timestamp,
                    this.pendingTransactions,
                    hash
                );
                
                await this.chain.put(index, newBlock);
                this.height++;
                this.pendingTransactions = []; // Vaciar las transacciones pendientes
                resolve(newBlock);
            }
        });
    }
    getBlock(index: number): Promise<Block> {
        return new Promise(async (resolve, reject) => {
            if (index > this.height || index < 0) {
                reject("Block not found");
            }
            resolve(this.chain.get(index));
        });
    }
}

export { Blockchain };
