import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";

export interface Statement {
	execute(programState: ProgramState): ProgramState | null;
	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type>;
	deepCopy(): Statement;
	toString(): string;
}