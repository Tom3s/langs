class Item:
    def __init__ (self, l: str, r: list, d: int):
        self.lhs: str = l
        self.rhs: list = r
        self.dotPos: int = d

    def getLhs(self) :
        return self.lhs
    
    def getRhs(self) :
        return self.rhs
    
    def getDotPos(self):
        return self.dotPos
    
    def to_string(self):

        string_right_hand_side1 = ' '.join(self.getRhs()[:self.getDotPos()])
        string_left_hand_side2 = ' '.join(self.getRhs()[self.getDotPos():])

        return f"{self.lhs} -> {string_right_hand_side1}.{string_left_hand_side2}"


    def __eq__(self, other_item):
        return (
            isinstance(other_item, Item) and
            self.lhs == other_item.lhs and
            self.rhs == other_item.rhs and
            self.dotPos == other_item.dotPos
        )
    
    def __hash__(self):
        result = self.lhs[0]
        if ( type(self.rhs) == list):
            for i in self.rhs:
                result = result + i
        else:
            result = result+self.rhs
        
        return hash(result)
