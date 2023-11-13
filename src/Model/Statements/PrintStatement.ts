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
			const evaluatedString = printable.evaluate(programState.symbolTable).body.toString();
			programState.output.push(evaluatedString);
			// console.log(evaluatedString);
			process.stdout.write(evaluatedString);
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