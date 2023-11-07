import SymbolTable from "./ADT/SymbolTable";
import { Statement } from "./Statements/Statement";

export class ProgramState {
	constructor (
		public executionStack: Statement[],
		public symbolTable: SymbolTable,
		public output: string[],
		public originalProgram: Statement,
	) {
		this.executionStack.push(originalProgram.deepCopy());
	}

	oneStep(): ProgramState | null {
		if (this.executionStack.length <= 0) {
			throw new Error("Execution stack is empty");
		}
		// console.log("SymbolTable")
		// console.log(this.symbolTable);
		const currentStatement = this.executionStack.pop();
		// console.log("Current statement");
		// console.log(currentStatement);
		if (currentStatement === undefined) {
			throw new Error("Execution stack is empty");
		}
		return currentStatement.execute(this);
	}

	reset(
		executionStack: Statement[] = [],
		symbolTable: SymbolTable = new SymbolTable(16),
		output: string[] = [],
	) {
		this.executionStack = executionStack;
		this.symbolTable = symbolTable;
		this.output = output;
		this.executionStack.push(this.originalProgram.deepCopy());
	}

}