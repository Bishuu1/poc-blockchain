import crypto from 'crypto';
import { Transaction } from "./transaction";


class Block {
    constructor(
        public readonly index: number,
        public readonly previousHash: any,
        public readonly timestamp: number,
        public readonly transactions: Transaction[],
        public readonly hash: any
    ) {}
    static calculateHash(
        // Calcula el hash de un bloque
        index: number,
        previousHash: any,
        timestamp: number,
        transactions: Transaction[]
    ): string {
        const data =
            index + previousHash + timestamp + JSON.stringify(transactions);
        return crypto.createHash('sha256').update(data).digest("hex");
    }
    validate(): Promise<boolean> {
        // Valida el bloque
        return new Promise((resolve, reject) => {
            let currentHash = this.hash;
            const calculatedHash = Block.calculateHash(
                this.index,
                this.previousHash,
                this.timestamp,
                this.transactions
            );
            if (currentHash === calculatedHash) {
                return true;
            } else {
                return false;
            }
        });
    }
}

export { Block };
