import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import SymbolTable from "./Model/ADT/SymbolTable";
import { CompoundStatement } from "./Model/Statements/CompoundStatement";
import { DeclarationStatement } from "./Model/Statements/DeclarationStatement";
import { IntegerType } from "./Model/Types/IntegerType";
import { IntegerValue } from "./Model/Values/IntegerValue";
import { ValueExpression } from "./Model/Expressions/ValueExpression";
import { FunctionDeclarationStatement } from "./Model/Statements/FunctionDeclarationStatement";
import { WhileStatement } from "./Model/Statements/WhileStatement";
import { RelationalExpression, RelationalOperator } from "./Model/Expressions/RelationalExpression";
import { VariableExpression } from "./Model/Expressions/VariableExpression";
import { IfStatement } from "./Model/Statements/IfStatement";
import { AssignStatement } from "./Model/Statements/AssignStatement";
import { ArithmeticExpression, ArithmeticOperator } from "./Model/Expressions/ArithmeticExpression";
import { ReturnStatement } from "./Model/Statements/ReturnStatement";
import { StringValue } from "./Model/Values/StringValue";
import { PrintStatement } from "./Model/Statements/PrintStatement";
import { FunctionCallExpression } from "./Model/Expressions/FunctionCallExpression";
import { ProgramState } from "./Model/ProgramState";
import { MethodCallExpression } from "./Model/Expressions/MethodCallExpression";
import { ReadExpression } from "./Model/Expressions/ReadExpression";
import { FunctionValue } from "./Model/Values/FunctionValue";
import { StringType } from "./Model/Types/StringType";
import { ConversionExpression } from "./Model/Expressions/ConversionExpression";

const lexer = new Lexer('../lab1/p2.whatever');
const tokens = lexer.tokenize();
const parser = new Parser(tokens);

// try {
//     parser.parse();
//     console.log('Syntax is correct!');
// } catch (error: any) {
//     console.error('Syntax error:', error?.message);
// }

const asd = new CompoundStatement([
	new DeclarationStatement('a', new IntegerType(), false, new MethodCallExpression(new ReadExpression(), 'toInt', [])),
	new DeclarationStatement('b', new IntegerType(), false, new MethodCallExpression(new ReadExpression(), 'toInt', [])),
	new DeclarationStatement('c', new IntegerType(), false, new MethodCallExpression(new ReadExpression(), 'toInt', [])),
	new FunctionDeclarationStatement('gcd', [
		new DeclarationStatement('a', new IntegerType()),
		new DeclarationStatement('b', new IntegerType()),
	],
		new IntegerType(),
		new CompoundStatement([
			new WhileStatement(
				new RelationalExpression(
					new VariableExpression('a'),
					new VariableExpression('b'),
					RelationalOperator.NOT_EQUAL
				),
				new IfStatement(
					new RelationalExpression(
						new VariableExpression('a'),
						new VariableExpression('b'),
						RelationalOperator.GREATER_THAN
					),
					new AssignStatement(
						'a',
						new ArithmeticExpression(
							new VariableExpression('a'),
							new VariableExpression('b'),
							ArithmeticOperator.SUBTRACT
						)
					),
					new AssignStatement(
						'b',
						new ArithmeticExpression(
							new VariableExpression('b'),
							new VariableExpression('a'),
							ArithmeticOperator.SUBTRACT
						)
					)
				)
			),
			new ReturnStatement(new VariableExpression('a'))
		])
	),
	new PrintStatement([
		new ValueExpression(new StringValue('GCD of the numbers is: ')),
		new FunctionCallExpression('gcd', [
			new VariableExpression('a'),
			new FunctionCallExpression(
				'gcd',
				[
					new VariableExpression('b'),
					new VariableExpression('c')
				]
			)
		]
		)
	])
]);

console.log(asd.toString());

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

const program = new ProgramState(
	[],
	prefilledSymbolTable,
	[],
	asd
)

while (true) {
	try {
		program.oneStep();
	} catch (error: any) {
		console.error(error?.message);
		console.log(`Output: ${program.output}`)
		break;
	}
}