import re
class Grammar :
	def __init__(self,nonTerminals = [],terminals = [],startingSymbol = "", productions = dict(), inFile = r".\\g1_2.txt"):
		self.SEPARATOR_OR_TRANSITION  = "\\|"
		self.TRANSITION_CONCATENATION = " "
		self.SEPARATOR_LEFT_RIGHT_HAND_SIDE = "->"
		self.terminals = terminals
		self.notTerminals = nonTerminals
		self.productions = productions
		self.startingSymbol  = startingSymbol
		self.EPSILON = "EPS"
		self.isCFG = True
		self.enrichedStartingGrammarSymbol = "S0"
		if len(terminals) ==0 :
			self.readFromFile(inFile)

	def getTerminals(self):
		return self.terminals
	
	def getNonTerminals(self):
		return self.notTerminals
	
	def getProductions(self):
		return self.productions
	
	def getStartingSymbol(self):
		return self.startingSymbol
	
	def getIsCGF(self):
		if ( self.isCFG):
			return True
		return False
	
	def getEnrichedGrammar(self):
		enrichedGrammar = Grammar(self.notTerminals, self.terminals, self.enrichedStartingGrammarSymbol, self.productions)
		enrichedGrammar.notTerminals.append(self.enrichedStartingGrammarSymbol)
		enrichedGrammar.productions[self.enrichedStartingGrammarSymbol] = list()
		l = list()
		l.append(self.startingSymbol)
		enrichedGrammar.productions[self.enrichedStartingGrammarSymbol].append(l)

		return enrichedGrammar
		
	def getProductionsForNonTerminal(self,nonterminal):
		if ( nonterminal not in self.getNonTerminals() ) : return None
		return self.productions[nonterminal]

	def processProduction(self,line):
		leftRightHandside = re.split(self.SEPARATOR_LEFT_RIGHT_HAND_SIDE, line)
		splitedLeftSide = re.split(self.TRANSITION_CONCATENATION,leftRightHandside[0])
		splitedRightSide = re.split(self.SEPARATOR_OR_TRANSITION, leftRightHandside[1])
		if splitedLeftSide[0] not in self.productions.keys() :
			newList = list()
			self.productions[splitedLeftSide[0]] = newList

		for rhs in splitedRightSide:
			split = rhs.split(self.TRANSITION_CONCATENATION)
			filtered_list = [s for s in split if s]
			stripped_list = [s.replace('\n', '') for s in filtered_list]

			self.productions[splitedLeftSide[0]].append(stripped_list)

	def checkIfCFG(self):
		if( self.startingSymbol not in self.notTerminals): 
		  
			return False
		for lefthandside in self.productions.keys():
			if lefthandside not in self.notTerminals :
				return False  
			
		for possibleNextMoves in self.productions.get(lefthandside):
			for possibleNextMove in possibleNextMoves:
				if possibleNextMove not in self.notTerminals and possibleNextMove not in self.terminals and possibleNextMove != self.EPSILON:
					print( possibleNextMove)
					
					return False
		return True
	

	def readFromFile(self, inFile):
		with open(inFile,"r") as file:
			for index, line in enumerate(file):
				if (index < 3 ):		  
					terminalBoth = re.split(r'[&\n]+', line)
					filtered_terminal_list = [s for s in terminalBoth if s]				   
					if ( index == 0):self.notTerminals = filtered_terminal_list
					elif( index == 1):self.terminals = filtered_terminal_list
					elif(index == 2): self.startingSymbol = filtered_terminal_list[0]

				else:
					self.processProduction(line)   
						
		self.isCFG = self.checkIfCFG()


