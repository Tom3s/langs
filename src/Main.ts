import SymbolTable from "./SymbolTable";

const symbolTable = new SymbolTable(128);

symbolTable.add("a", 1);
symbolTable.add("b", 2);

symbolTable.printAll();

console.log("Value of 'a': ", symbolTable.get("a"));
console.log("Value of 'b': ", symbolTable.get("b"));

symbolTable.add("string", "Hello World");
symbolTable.add("number", 123);

symbolTable.printAll();

console.log("Value of 'string': ", symbolTable.get("string"));
console.log("Value of 'number': ", symbolTable.get("number"));

symbolTable.remove("a");

symbolTable.printAll();
