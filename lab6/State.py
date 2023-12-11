from Item import Item
class State:
    def __init__(self,states = set()):
        self.items = states
    
    def getItems(self):
        return self.items
    
    def to_string(self):
        result = ""
        for item in self.items:
            # result = result + item.to_string()
            result += f'{item.to_string()}\n'

        return result
    
    def getSymbolsSucceedingTheDot(self):
        symbols = set()
        for item in self.items:
            if ( type(item.rhs == list)):
                if item.getDotPos() < len(item.getRhs()):
                    symbols.add((item.getRhs())[0])

            else:
                if item.getDotPos() < len(item.getRhs()) :
                    symbols.add(item.getRhs())
        return list(symbols)

    def __eq__(self, other_state):
            return (
                isinstance(other_state, State) and
                self.items == other_state.items 
            )
