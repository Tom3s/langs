import json


class Grammar:
	def __init__(self):
		self.nonterminals = set()
		self.terminals = set()
		self.productions = []
		self.start_symbol = None

	def read_grammar_from_file(self, file_path):
		with open(file_path, 'r') as file:
			for line in file:
				line = line.strip()
				if not line or line.startswith('#'):
					# Skip empty lines and comments
					continue
				self.process_grammar_line(line)

	def process_grammar_line(self, line):
		parts = line.split('::=')
		if len(parts) != 2:
			raise ValueError(f"Invalid production rule: {line}")

		partial_productions = parts[1].split(' | ')
  
		for production in partial_productions:
			left_side = parts[0].strip()
			right_side = production.strip()

			# Add nonterminal to set of nonterminals
			self.nonterminals.add(left_side)

			# Split right-hand side into individual symbols
			symbols = right_side.split()

			# Add symbols to set of terminals or nonterminals
			for symbol in symbols:
				if self.is_terminal(symbol):
					if symbol.startswith('"') and symbol.endswith('"'):
						symbol = symbol[1:-1] 
					self.terminals.add(symbol)

			# Add production to list of productions
			self.productions.append((left_side, symbols))

		# Set the start symbol if not set yet
		if self.start_symbol is None:
			self.start_symbol = left_side

	def is_terminal(self, symbol: str) -> bool:
		if symbol.isupper():
			return True
		if symbol.startswith('"') and symbol.endswith('"'):
			return True
		return False

	def print_nonterminals(self):
		print("Nonterminals:", 
			json.dumps(list(self.nonterminals), indent=4, sort_keys=True)
        )

	def print_terminals(self):
		print("Terminals:", 
			json.dumps(list(self.terminals), indent=4, sort_keys=True)
		)

	def print_productions(self):
		print("Productions:")
		for production in self.productions:
			print(f"{production[0]} -> {' '.join(production[1])}")

	def productions_for_nonterminal(self, nonterminal):
		matching_productions = [prod[1] for prod in self.productions if prod[0] == nonterminal]
		return matching_productions

	def is_cfg(self):
		# Check if every production is in the form A -> α, where α is a string of terminals and nonterminals
		for production in self.productions:
			if not production[1]:
				# Handle ε-productions
				continue
			for symbol in production[1]:
				if symbol not in self.terminals and symbol not in self.nonterminals:
					return False
		return True


# Example Usage:
grammar = Grammar()
grammar.read_grammar_from_file('lab6/grammar.txt')

grammar.print_nonterminals()
grammar.print_terminals()
grammar.print_productions()

nonterminal = 'S'
print(f"Productions for {nonterminal}: {grammar.productions_for_nonterminal(nonterminal)}")

if grammar.is_cfg():
	print("The grammar is a context-free grammar (CFG).")
else:
	print("The grammar is not a context-free grammar (CFG).")
