import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { IReceiptProof } from "./types";
export declare class RelayHubSdk {
    constructor();
    createReceiptProof(web3: Web3, receipt: TransactionReceipt, confirmations?: number): Promise<IReceiptProof>;
}
