import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Statement } from "./Statement";

export class NOPStatement implements Statement {
	constructor () { }
	execute(programState: ProgramState): ProgramState | null {
		return null;
	}

	deepCopy(): Statement {
		return new NOPStatement();
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		return typeEnvironment;
	}

	toString(): string {
		return "";
	}
}