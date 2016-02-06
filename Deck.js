var Deck = function( cardConstructor ) {
	if( !Deck.prototype.isValidCardConstructor( cardConstructor ) ) {
		throw "Invalid Card constructor";	
	}
	
	var suits = cardConstructor.prototype.SUITS.length;	
	var values = cardConstructor.prototype.VALUES.length;	
	this.cards = [];
	for( var i = 0; i < suits * values; i++ ) {
		var card = cardConstructor.prototype.create( i );
		this.pushCard( card );
	}
	
};
Deck.prototype = Stack.prototype.create();
$.extend( true, Deck.prototype, {
	cards: [],
	isValidCardConstructor: function( cardConstructor) {
		if( cardConstructor.prototype.VALUES && cardConstructor.prototype.VALUES.length &&
			cardConstructor.prototype.SUITS && cardConstructor.prototype.SUITS.length && 
			typeof cardConstructor.prototype.create === "function" ) {
			return true;	
		}
		return false;
	},
	create: function( cardConstructor ) {
		return new Deck( cardConstructor );	
	},
	toString: function() {
		return this.cards.join(", ");
	},
	shuffle: function() {
		var shuffled = [], numCards = this.cards.length;
		for( var i = 0; i < numCards; i++) {
			var j = Math.floor( Math.random() * this.cards.length );
			shuffled.push( this.cards[ j ] );
			this.cards.splice( j, 1 );
		}			
		this.cards = shuffled;
	}
});
