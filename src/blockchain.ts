import { Block } from "./block";
import { Transaction } from "./transaction";
import { Level } from "level";

class Blockchain {  
    private chain: any;
    private height: number;
    constructor() {
        this.height = -1;
        this.chain = new Level('./db', { valueEncoding: 'json' });
    }

    private createGenesisBlock(): any { 
        if (this.height != -1) {
            throw new Error("Genesis block already created");
        }
        const hash = Block.calculateHash(0, null, Date.now(), []);
        return new Block(0, null, Date.now(), [], hash);
    }
    addBlock(transactions: Transaction[]): Promise<Block> {
        return new Promise(async (resolve, reject) => {
            if (this.height < 0) {
                const gen = this.createGenesisBlock()
                await this.chain.put(0, gen); //revisar
                this.height++;
                resolve(this.chain.get(0));
        }   
            var index = this.height+1;
            var previousHash = this.chain.get(this.height).hash;
            var timestamp = Date.now();
            console.log("timestamp: ")
            var hash = Block.calculateHash(index, previousHash, timestamp, transactions);
            let newBlock = new Block(
                index,
                previousHash,
                timestamp,
                transactions,
                hash
            );
            this.chain.put(this.height, newBlock);
            this.height++;
            resolve(newBlock);
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
