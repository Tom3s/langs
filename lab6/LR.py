from Grammar import Grammar
from Item import Item
from State import State
from CanonicalCollection import CanonicalCollection


class LR:
    def __init__(self,grammar):
        
        self.grammar = grammar
        self.workingGrammar = grammar.getEnrichedGrammar()

    
    def getNonTerminalAfterDot(self, item):
        term  = list(item.getRhs())
        productions = self.grammar.getProductions()
        if ( item.getDotPos() < len(term)) :
            if ( term[item.getDotPos()] not in productions.keys()):
                return None
        
            return term[item.getDotPos()]
    
        return None


    def closure(self, item):
        current_closure = set()
        current_closure.add(item)
        old_closure = set()
       
        while old_closure != current_closure:
            old_closure = current_closure
            new_closure = set(current_closure)

            for item in current_closure:

                non_terminal = self.getNonTerminalAfterDot(item)
                if non_terminal:
                    for prod in self.grammar.getProductionsForNonTerminal(non_terminal):
                        current_item = Item(non_terminal, prod, 0)
                        new_closure.add(current_item)

            current_closure = new_closure

        return State(current_closure)

    def goto(self,state,element):
        result = set()

        for item in state.getItems():
            if ( len(item.getRhs()) > item.getDotPos()):
                nonTerminal = list(item.getRhs())[item.getDotPos()] # get the symbol that is afer the do in each item 
                if nonTerminal == element:
                    
                    nextItem = Item(item.getLhs(), item.getRhs(), item.getDotPos() + 1)
                    newState = self.closure(nextItem)
                    items = newState.getItems()
                    for item in items:
                        result.add(item)
               
        newResult  = State(result)
        return newResult
            

    def canonicalCollection(self):
        canonicalCollection = CanonicalCollection()
        canonicalCollection.addState(self.closure(Item(self.workingGrammar.getStartingSymbol(),self.workingGrammar.getProductionsForNonTerminal(self.workingGrammar.startingSymbol)[0],0))) # ['program']

        index = 0
        while(index < len(canonicalCollection.getStates())):
            for symbol in canonicalCollection.getStates()[index].getSymbolsSucceedingTheDot():
                newState = self.goto(canonicalCollection.getStates()[index], symbol)
                
                if not len(newState.items) == 0 :
                    if (newState not in canonicalCollection.getStates()):
                        canonicalCollection.addState(newState)
           
            index = index + 1

        return canonicalCollection
                   

    def getGrammar(self):
        return self.grammar


    def getWorkigGrammar(self):
        return self.workingGrammar
