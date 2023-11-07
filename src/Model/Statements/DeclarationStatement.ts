import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Statement } from "./Statement";

export class DeclarationStatement implements Statement {
	constructor (
		public name: string,
		public type: Type,
		public constant: boolean = false,
		public value: Expression | null = null,	
	) { }

	execute(programState: ProgramState): ProgramState | null {
		// const symbolTable = programState.symbolTable;

		if (programState.symbolTable.has(this.name)) {
			throw new Error(`Variable ${this.name} already declared`);
		}

		if (this.constant && this.value === null) {
			throw new Error(`Constant ${this.name} must be initialized`);
		} 

		console.log(`Declaring ${this.name} as ${this.type.toString()}`)

		if (this.value === null) {
			programState.symbolTable.add(this.name, this.type.defaultValue());
		} else {
			const value = this.value.evaluate(programState.symbolTable);
			programState.symbolTable.add(this.name, value);
		}

		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		typeEnvironment.set(this.name, this.type);
		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new DeclarationStatement(this.name, this.type, this.constant, this.value);
	}

	toString(): string {
		let ret = this.constant ? "const " : "var ";
		ret += `${this.name}: ${this.type.toString()}`;
		if (this.value !== null) {
			ret += ` = ${this.value.toString()}`;
		}

		return ret;
	}
}