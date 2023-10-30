"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HashTable {
    constructor(size) {
        this.keys = new Array(size);
        this.values = new Array(size);
        this.fullSize = size;
    }
    resize() {
        this.fullSize *= 2;
        const oldKeys = this.keys;
        const oldValues = this.values;
        this.keys = new Array(this.fullSize);
        this.values = new Array(this.fullSize);
        for (let i = 0; i < oldKeys.length; i++) {
            const key = oldKeys[i];
            const value = oldValues[i];
            if (key !== undefined && value !== undefined) {
                this.add(key, value);
            }
        }
    }
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % this.fullSize;
    }
    add(key, value) {
        let index = this.hash(key);
        while (this.keys[index] !== undefined) {
            if (this.keys[index] === key) {
                throw new Error('Key must be unique');
            }
            index++;
            if (index >= this.fullSize) {
                this.resize();
                index = 0;
                this.add(key, value);
            }
        }
        this.keys[index] = key;
        this.values[index] = value;
    }
    remove(key) {
        let index = this.hash(key);
        while (index < this.fullSize && this.keys[index] !== key) {
            index++;
        }
        if (index === this.fullSize) {
            throw new Error('Key not found');
        }
        this.keys[index] = undefined;
    }
    get(key) {
        let index = this.hash(key);
        while (index < this.fullSize && this.keys[index] !== key) {
            index++;
        }
        if (index === this.fullSize) {
            throw new Error('Key not found');
        }
        return this.values[index];
    }
    size() {
        let size = 0;
        for (let i = 0; i < this.fullSize; i++) {
            if (this.keys[i] !== undefined) {
                size++;
            }
        }
        return size;
    }
    printAll() {
        for (let i = 0; i < this.fullSize; i++) {
            if (this.keys[i] !== undefined) {
                console.log(`${i}: ${this.keys[i]} -> ${this.values[i]}`);
            }
        }
    }
}
exports.default = HashTable;
;
