"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RelayHubSdk = void 0;
var merkle_patricia_tree_1 = require("merkle-patricia-tree");
var web3_utils_1 = require("web3-utils");
var ethereumjs_util_1 = require("ethereumjs-util");
var sendJsonRpcRequest = function (web3, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                web3.currentProvider.send(data, function (error, result) {
                    if (error)
                        return reject(error);
                    if (result.error)
                        return reject(result.error);
                    resolve(result.result);
                });
            })];
    });
}); };
var isTypedReceipt = function (receipt) {
    if (!receipt.type)
        return false;
    var hexType = typeof receipt.type === 'number' ? (0, web3_utils_1.numberToHex)(receipt.type) : receipt.type;
    return receipt.status != null && hexType !== "0x0" && hexType !== "0x";
};
var getReceiptBytes = function (receipt) {
    var encodedData = ethereumjs_util_1.rlp.encode([
        (0, ethereumjs_util_1.toBuffer)((0, web3_utils_1.hexToNumber)(receipt.status ? 1 : 0)),
        (0, ethereumjs_util_1.toBuffer)((0, web3_utils_1.hexToNumber)(receipt.cumulativeGasUsed)),
        (0, ethereumjs_util_1.toBuffer)(receipt.logsBloom),
        // encoded log array
        receipt.logs.map(function (l) {
            // [address, [topics array], data]
            return [
                (0, ethereumjs_util_1.toBuffer)(l.address),
                l.topics.map(ethereumjs_util_1.toBuffer),
                (0, ethereumjs_util_1.toBuffer)(l.data), // convert data to buffer
            ];
        }),
    ]);
    if (isTypedReceipt(receipt)) {
        encodedData = Buffer.concat([(0, ethereumjs_util_1.toBuffer)(receipt.type), encodedData]);
    }
    return encodedData;
};
var blockToRlp = function (block) {
    return ethereumjs_util_1.rlp.encode([
        (0, ethereumjs_util_1.toBuffer)(block.parentHash),
        (0, ethereumjs_util_1.toBuffer)(block.sha3Uncles),
        (0, ethereumjs_util_1.toBuffer)(block.miner),
        (0, ethereumjs_util_1.toBuffer)(block.stateRoot),
        (0, ethereumjs_util_1.toBuffer)(block.transactionsRoot),
        (0, ethereumjs_util_1.toBuffer)(block.receiptsRoot),
        (0, ethereumjs_util_1.toBuffer)(block.logsBloom),
        Number(block.difficulty),
        Number(block.number),
        Number(block.gasLimit),
        Number(block.gasUsed),
        Number(block.timestamp),
        (0, ethereumjs_util_1.toBuffer)(block.extraData),
        (0, ethereumjs_util_1.toBuffer)(block.mixHash),
        (0, web3_utils_1.padLeft)(block.nonce, 8),
    ]);
};
var RelayHubSdk = /** @class */ (function () {
    function RelayHubSdk() {
    }
    RelayHubSdk.prototype.createReceiptProof = function (web3, receipt, confirmations) {
        if (confirmations === void 0) { confirmations = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var block, receiptKey, receiptsPromises, _i, _a, txHash, receipts, trie, _b, receipts_1, receipt_1, path, data, foundPath, blockProofs, i, nextBlock, rawReceipt, proofPath, proofSiblings;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, web3.eth.getBlock(receipt.blockNumber)];
                    case 1:
                        block = _c.sent();
                        receiptKey = ethereumjs_util_1.rlp.encode((0, web3_utils_1.hexToNumber)(receipt.transactionIndex));
                        receiptsPromises = [];
                        for (_i = 0, _a = block.transactions; _i < _a.length; _i++) {
                            txHash = _a[_i];
                            receiptsPromises.push(web3.eth.getTransactionReceipt(txHash));
                        }
                        return [4 /*yield*/, Promise.all(receiptsPromises)];
                    case 2:
                        receipts = _c.sent();
                        receipts = receipts.sort(function (a, b) {
                            return a.transactionIndex - b.transactionIndex;
                        });
                        receipts = receipts.map(function (r) {
                            if (!r.type)
                                r.type = 0;
                            if (typeof r.status === 'boolean') {
                                r.status = Number(r.status);
                            }
                            return r;
                        });
                        console.log(receipts);
                        trie = new merkle_patricia_tree_1.BaseTrie();
                        _b = 0, receipts_1 = receipts;
                        _c.label = 3;
                    case 3:
                        if (!(_b < receipts_1.length)) return [3 /*break*/, 6];
                        receipt_1 = receipts_1[_b];
                        path = ethereumjs_util_1.rlp.encode((0, web3_utils_1.hexToNumber)(receipt_1.transactionIndex)), data = getReceiptBytes(receipt_1);
                        return [4 /*yield*/, trie.put(path, data)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _b++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, trie.findPath(receiptKey, true)];
                    case 7:
                        foundPath = _c.sent();
                        if (foundPath.remaining.length > 0) {
                            throw new Error("Can't find node in the trie");
                        }
                        if (trie.root.toString('hex') !== block.receiptsRoot.substr(2)) {
                            throw new Error("Incorrect receipts root: ".concat(trie.root.toString('hex'), " != ").concat(block.receiptsRoot.substr(2)));
                        }
                        blockProofs = [blockToRlp(block).toString('hex')];
                        i = 1;
                        _c.label = 8;
                    case 8:
                        if (!(i < confirmations)) return [3 /*break*/, 11];
                        return [4 /*yield*/, web3.eth.getBlock(block.number + i)];
                    case 9:
                        nextBlock = _c.sent();
                        blockProofs.push('0x' + blockToRlp(nextBlock).toString('hex'));
                        _c.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 8];
                    case 11:
                        if (isTypedReceipt(receipt)) {
                            rawReceipt = '0x' + foundPath.node.value.toString('hex');
                        }
                        else {
                            rawReceipt = '0x' + foundPath.node.value.toString('hex');
                        }
                        proofPath = '0x' + Buffer.concat([Buffer.from('00', 'hex'), receiptKey]).toString('hex');
                        proofSiblings = '0x' + ethereumjs_util_1.rlp.encode(foundPath.stack.map(function (s) { return s.raw(); })).toString('hex');
                        return [2 /*return*/, {
                                blockProofs: blockProofs,
                                rawReceipt: rawReceipt,
                                proofPath: proofPath,
                                proofSiblings: proofSiblings,
                                blockHash: block.hash,
                                receiptHash: block.receiptsRoot
                            }];
                }
            });
        });
    };
    return RelayHubSdk;
}());
exports.RelayHubSdk = RelayHubSdk;
