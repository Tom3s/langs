import { Expression } from "../Expressions/Expression";
import { ProgramState } from "../ProgramState";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Statement } from "./Statement";

export class PrintStatement implements Statement {
	constructor (
		public printables: Expression[],
	) { }

	execute(programState: ProgramState): ProgramState | null {
		this.printables.forEach(printable => {
			programState.output.push(printable.evaluate(programState.symbolTable).body.toString());
			console.log(printable.evaluate(programState.symbolTable).body.toString());
		});
		return null;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Map<string, Type> {
		return typeEnvironment;
	}

	deepCopy(): Statement {
		return new PrintStatement(this.printables);
	}

	toString(): string {
		return `print(${this.printables.map(printable => printable.toString()).join(", ")})\n`;
	}
}