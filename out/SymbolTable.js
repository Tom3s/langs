"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashTable_1 = require("./HashTable");
class SymbolTable {
    constructor(size) {
        this.hashTable = new HashTable_1.default(size);
    }
    add(key, value) {
        this.hashTable.add(key, value);
    }
    remove(key) {
        this.hashTable.remove(key);
    }
    get(key) {
        return this.hashTable.get(key);
    }
    size() {
        return this.hashTable.size();
    }
    printAll() {
        this.hashTable.printAll();
    }
}
exports.default = SymbolTable;
