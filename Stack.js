var Stack = function() {
	this.cards = [];
};
Stack.prototype = {
	cards: [],
	create: function() {
		return new Stack();
	},
	pushCard: function( card ) {
		this.cards.push( card );
	},
	popCard: function() {
		if( this.cards.length > 0 ) {
			return this.cards.pop();
		}
		throw "Stack is empty.";
	},
	peekCard: function() {
		if( this.size() === 0 ) {
			throw "Stack is empty.";
		}
		return this.cards[ this.size() - 1 ];
	},
	size: function() {
		return this.cards.length;
	}
};
