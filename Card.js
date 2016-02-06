var Card = function( id ) {
	if( !Card.prototype.isValidId( id ) ) {
		throw "Invalid identifier. Cannot create card.";
	}
	this.id = id;		
	
};
Card.prototype = {
	id: null,
	SUITS: [ "clubs","spades","hearts","diamonds"],
	VALUES: [ "ace","two","three","four","five","six","seven","eight","nine","ten","jack","queen","king" ],
	isValidId: function( id ) {
		return typeof id === "number" && id >= 0 && id < 52;
	},
	toString: function() {
		if( !Card.prototype.isValidId( this.id ) ) {
			throw "Invalid identifier.";
		}		
		return Card.prototype.VALUES[ this.value() ] + " of " + Card.prototype.SUITS[ this.suit() ];
	},
	suit: function() {
		if( !Card.prototype.isValidId( this.id ) ) {
			throw "Invalid identifier.";
		}		
		return Math.floor( this.id / Card.prototype.VALUES.length );
	},
	suitName: function() {
		return this.SUITS[ this.suit() ];
	},
	value: function() {
		if( !Card.prototype.isValidId( this.id ) ) {
			throw "Invalid identifier.";
		}		
		return this.id % Card.prototype.VALUES.length;
	},
	valueName: function() {
		return this.VALUES[ this.value() ];
	},
	create: function( id ) {
		if( typeof id !== "number" ) {
			var suitAndValue = id.split( "-" );
			var suit = Card.prototype.SUITS.indexOf( suitAndValue[ 0 ] );
			var value = Card.prototype.VALUES.indexOf( suitAndValue[ 1 ] );
			var id = suit * Card.prototype.VALUES.length + value;
		}
		return new Card( id );
	},
	equals: function( card ) {
		return this.id === card.id;
	}
};
