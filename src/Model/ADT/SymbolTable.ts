import HashTable from "../../HashTable";
import { Value } from "../Values/Value";

export default class SymbolTable {
	private hashTable: HashTable<Value>;

	constructor(size: number) {
		this.hashTable = new HashTable(size);
	}

	add(key: string, value: Value): void {
		this.hashTable.add(key, value);
	}

	remove(key: string): void {
		this.hashTable.remove(key);
	}

	get(key: string): Value | undefined{
		return this.hashTable.get(key);
	}

	size(): number {
		return this.hashTable.size();
	}

	printAll(): void {
		this.hashTable.printAll();
	}
	
	has(key: string): boolean {
		return this.hashTable.has(key);
	}

	set(key: string, value: Value): void {
		this.hashTable.set(key, value);
	}
}