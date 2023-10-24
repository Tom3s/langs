import HashTable from "./HashTable";

export default class SymbolTable {
	private hashTable: HashTable;

	constructor(size: number) {
		this.hashTable = new HashTable(size);
	}

	add(key: string, value: string | number): void {
		this.hashTable.add(key, value);
	}

	remove(key: string): void {
		this.hashTable.remove(key);
	}

	get(key: string): string | number | undefined{
		return this.hashTable.get(key);
	}

	size(): number {
		return this.hashTable.size();
	}

	printAll(): void {
		this.hashTable.printAll();
	}
}