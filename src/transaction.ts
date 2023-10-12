// transaction.ts
import * as crypto from "crypto";
import { Wallet } from "./wallet";
import { randomBytes } from "tweetnacl";
class Transaction {
    public fromAddress: string;
    public toAddress: string;
    public amount: number;
    public signature: string;
    public nonce: number;
    constructor(fromAddress: string, toAddress: string, amount: number, nonce: number = Math.floor(Math.random() * 10)) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.nonce = nonce; 
        this.signature = "unsigned";
    }
    public isValid(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.fromAddress) {
                reject("No from address in this transaction");
            }
            if (!this.signature || this.signature.length === 0) {
                reject("No signature in this transaction");
            }
            const publicKey = crypto.createVerify("SHA256");
            publicKey.update(
                Buffer.from(
                    this.fromAddress +
                    this.toAddress +
                    this.amount.toString() +
                    this.nonce.toString()
                )
            );
            const isValid = publicKey.verify(this.fromAddress, this.signature);
            resolve(isValid);
        });
    }
    
}

export { Transaction };