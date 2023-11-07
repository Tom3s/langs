import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class FreeStatement implements Statement {
	constructor (
		public identifier: string,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		const symbolTable = programState.symbolTable;
		if (!symbolTable.has(this.identifier)) {
			throw new Error(`Variable ${this.identifier} not declared`);
		}

		symbolTable.remove(this.identifier);
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		if (!typeEnvironment.has(this.identifier)) {
			throw new Error(`Variable ${this.identifier} not declared`);
		}

		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new FreeStatement(this.identifier);
	}

	toString(): string {
		return `free ${this.identifier}\n`;
	}
}