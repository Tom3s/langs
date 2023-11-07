import HashTable from "../../HashTable";

export class Heap<Value> {
	
    // private Map<Integer, Value> map;

    // public CHeap(){
    //     this.map = new HashMap<Integer, Value>();
    // }

	constructor(
		private map: HashTable<Value>
	) {}

    // @Override
    // public int add(Value value) {
    //     int hash = value.hashCode();
    //     int key = Integer.valueOf(hash);
    //     while (this.map.containsKey(key)){
    //         key = Integer.valueOf(key + 1).hashCode();
    //     }
    //     this.map.put(key, value);
    //     return key;
    // }
	
    // /**
    //  * @param key the key to look up
    //  * @throws HeapNoEntryException if key is not in the heap
    //  * @return the value associated with the key
    //  */
    // @Override
    // public Value lookUp(int key) throws HeapNoEntryException{
    //     var value = this.map.get(key);
    //     if (value == null){
    //         throw new HeapNoEntryException(key);
    //     }
    //     return value;
    // }

    // @Override
    // public boolean containsKey(int key) {
    //     return this.map.containsKey(key);
    // }

    // @Override
    // public void update(int key, Value newValue) throws HeapNoEntryException {
    //     if (!this.containsKey(key)) throw new HeapNoEntryException();
    //     this.map.put(key, newValue);
    // }

    // @Override
    // public void remove(int key) throws HeapNoEntryException {
    //     if (!this.containsKey(key)) throw new HeapNoEntryException();
    //     this.map.remove(key);        
    // }

    // @Override
    // public String toString(){
    //     return this.map.toString();
    // }

    // @Override
    // public Map<Integer, Value> getContent() {
    //     return this.map;
    // }

    // @Override
    // public void setContent(Map<Integer, Value> newContent) {
    //     this.map = newContent;
    // }

    
}