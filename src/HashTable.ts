export default class HashTable {
	private keys: [string | undefined];
	private values: [string | number | undefined];
	private fullSize: number;

	constructor(size: number) {
		this.keys = new Array(size) as [string | undefined];
		this.values = new Array(size) as [string | undefined];
		this.fullSize = size;
	}

	resize(): void {
		this.fullSize *= 2;
		const oldKeys = this.keys;
		const oldValues = this.values;
		this.keys = new Array(this.fullSize) as [string | undefined];
		this.values = new Array(this.fullSize) as [string | number | undefined];
		for (let i = 0; i < oldKeys.length; i++) {
			const key = oldKeys[i];
			const value = oldValues[i];
			if (key !== undefined && value !== undefined) {
				this.add(key, value);
			}
		}
	}

	hash(key: string): number {
		let hash = 0;
		for (let i = 0; i < key.length; i++) {
			hash += key.charCodeAt(i);
		}
		return hash % this.fullSize;
	}

	add(key: string, value: string | number): void {
		let index = this.hash(key);
		while (this.keys[index] !== undefined) {
			if (this.keys[index] === key) {
				throw new Error('Key must be unique');
			}
			index++;

			if (index >= this.fullSize) {
				this.resize()
				index = 0;
				this.add(key, value);
			}
		}
		this.keys[index] = key;
		this.values[index] = value;
	}

	remove(key: string): void {
		let index = this.hash(key);
		while (index < this.fullSize && this.keys[index] !== key) {
			index++;
		}
		if (index === this.fullSize) {
			throw new Error('Key not found');
		}

		this.keys[index] = undefined;
	}

	get(key: string): string | number | undefined {
		let index = this.hash(key);
		while (index < this.fullSize && this.keys[index] !== key) {
			index++;
		}
		if (index === this.fullSize) {
			throw new Error('Key not found');
		}
		return this.values[index];
	}	

	size(): number {
		let size = 0;
		for (let i = 0; i < this.fullSize; i++) {
			if (this.keys[i] !== undefined) {
				size++;
			}
		}
		return size;
	}

	printAll(): void {
		for (let i = 0; i < this.fullSize; i++) {
			if (this.keys[i] !== undefined) {
				console.log(`${i}: ${this.keys[i]} -> ${this.values[i]}`);
			}
		}
	}
};