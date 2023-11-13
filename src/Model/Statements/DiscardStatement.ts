import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class DiscardStatement implements Statement {
	constructor (
		public discardable: Expression
	) { }

	execute(programState: ProgramState): ProgramState | null {
		this.discardable.evaluate(programState.symbolTable);
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new DiscardStatement(this.discardable.deepCopy());
	}

	toString(): string {
		return this.discardable.toString();
	}
}