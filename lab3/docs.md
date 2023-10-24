# Lab 2

https://github.com/Tom3s/langs

## Hash Table Implementation

> - hash function:
> ```TS
> hash(key: string): number {
> 	let hash = 0;
> 	for (let i = 0; i < key.length; i++) {
> 		hash += key.charCodeAt(i);
> 	}
> 	return hash % this.fullSize;
> }
> ```

> - collision solution:
>  - find index, move to right if occupied, throw error if not unique, resize if full
> ```TS
> add(key: string, value: string | number): void {
> 	let index = this.hash(key);
> 	while (this.keys[index] !== undefined) {
> 		if (this.keys[index] === key) {
> 			throw new Error('Key must be unique');
> 		}
> 		index++;
> 		if (index >= this.fullSize) {
> 			this.resize()
> 			index = 0;
> 			this.add(key, value);
> 		}
> 	}
> 	this.keys[index] = key;
> 	this.values[index] = value;
> }
> ```