import SymbolTable from "./ADT/SymbolTable";
import { Statement } from "./Statements/Statement";

export class ProgramState {
	constructor (
		public executionStack: Array<Statement>,
		public symbolTable: SymbolTable,
		public output: string[],
		public originalProgram: string,
	) { }
	
}