import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import SymbolTable from "./Model/ADT/SymbolTable";
import { CompoundStatement } from "./Model/Statements/CompoundStatement";
import { DeclarationStatement } from "./Model/Statements/DeclarationStatement";
import { IntegerType } from "./Model/Types/IntegerType";
import { VariableExpression } from "./Model/Expressions/VariableExpression";
import { ReturnStatement } from "./Model/Statements/ReturnStatement";
import { ProgramState } from "./Model/ProgramState";
import { FunctionValue } from "./Model/Values/FunctionValue";
import { StringType } from "./Model/Types/StringType";
import { ConversionExpression } from "./Model/Expressions/ConversionExpression";
import { FloatType } from "./Model/Types/FloatType";
import { ExternalExpression } from "./Model/Expressions/ExternalExpression";

// process.argv.forEach(function (val, index, array) {
// 	console.log(index + ': ' + val);
// });

const lexer = new Lexer('.' + process.argv[2]);
// const lexer = new Lexer('../lab1/p3.whatever');
let tokens: any[] = [];
try {
	tokens = lexer.tokenize();
	
	const fs = require('fs');
	// fs.writeFileSync('PIF.out', JSON.stringify(tokens, null, '\t'));
	console.log('Lexically correct!');
} catch (error: any) {
	console.log('Lexical error:', error?.message);
	process.exit(1);
}
const parser = new Parser(tokens);

const prefilledSymbolTable = new SymbolTable(16);
prefilledSymbolTable.add('toInt', new FunctionValue(
	new IntegerType(),
	[
		new DeclarationStatement('s', new StringType())
	],
	new CompoundStatement([
		new ReturnStatement(
			new ConversionExpression(
				new VariableExpression('s'),
				new IntegerType()
			)
		)
	])
));
prefilledSymbolTable.add('sqrt', new FunctionValue(
	new FloatType(),
	[
		new DeclarationStatement('x', new FloatType())
	],
	new CompoundStatement([
		new ReturnStatement(
			new ExternalExpression(
				new FloatType(),
				[
					new VariableExpression('x')
				],
				Math.sqrt
			)
		)
	])
));

try {
	parser.parse();
	console.log('Syntax is correct!');
	const program = parser.getProgram();
	// console.log(program.toString());
	const programState = new ProgramState(
		[],
		prefilledSymbolTable,
		[],
		program
	);
	while (true) {
		try {
			programState.oneStep();
		} catch (error: any) {
			console.log('\n\n==========\nExecution stopped');
			console.error(error?.message);
			console.log(`Output: \n${programState.outputToString()}`)
			// require('fs').writeFileSync('ST.out', JSON.stringify(programState.symbolTable, null, '\t'));
			break;
		}
	}
} catch (error: any) {
	console.log('Syntax error:', error?.message);
}