import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class ReturnStatement implements Statement {
	constructor (
		public value: Expression | null,
	) { }

	execute(programState: ProgramState): ProgramState | null {
		// TODO: Implement
		programState.executionStack.push(this);
		return programState;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		
		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new ReturnStatement(this.value);
	}

	toString(): string {
		return `return ${this.value?.toString()}\n`;
	}
}