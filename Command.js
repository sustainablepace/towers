var Command = function( game, numCards, fromStackName, fromStackIndex, toStackName, toStackIndex ) {
	if( typeof numCards !== "number" || numCards <= 0 ) {
		throw "Invalid number of cards.";
	}
	var fromStack = game[ fromStackName ][ fromStackIndex ];
	var toStack   = game[ toStackName ][ toStackIndex ];
	if( !(fromStack instanceof Stack) || !(toStack instanceof Stack) ) {
		throw "Invalid stacks.";
	}
	this.game           = game;
	this.numCards       = numCards;
	this.fromStackName  = fromStackName;
	this.fromStackIndex = fromStackIndex;
	this.toStackName    = toStackName;
	this.toStackIndex   = toStackIndex;
};

Command.prototype = {
	create: function( game, numCards, fromStackName, fromStackIndex, toStackName, toStackIndex ) {
		return new Command( game, numCards, fromStackName, fromStackIndex, toStackName, toStackIndex );
	},
	run: function( fromStackName, fromStackIndex, toStackName, toStackIndex ) {
		var fromStack = this.game[ fromStackName ][ fromStackIndex ];
		var toStack   = this.game[ toStackName   ][ toStackIndex   ];
		if( fromStack.size() < this.numCards ) {
			throw "Insufficient number of cards on fromStack.";
		}
		var cards = [];
		for( var i = 0; i < this.numCards; i++ ) {
			cards.push( fromStack.popCard() );
		}
		for( var j = cards.length-1; j >= 0; j-- ) {
			toStack.pushCard( cards[ j ] );
		}
	},
	undo: function( cmd ) {
		return Command.prototype.create(
			cmd.game, cmd.numCards, cmd.toStackName, cmd.toStackIndex, cmd.fromStackName, cmd.fromStackIndex 
		);
	},
	execute: function() {
		this.run( this.fromStackName, this.fromStackIndex, this.toStackName, this.toStackIndex );
	}
};
