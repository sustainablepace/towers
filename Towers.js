var Towers = function() {
	this.init();
};
Towers.prototype = {
	NUM_SLOTS: 4,
	NUM_STACKS: 10,
	deck: null,
	stacks: [],
	orderedStacks: [],
	slots: [],
	commands: [],
	callbacks: [],
	winCallbacks: [],
	cardType: Card,
	init: function() {
		this.commands = [];
		this.callbacks = [];
		this.winCallbacks = [];
		this.stacks = [];
		this.stacks.id = "stacks";
		for( var i = 0; i < this.NUM_STACKS; i++ ) {
			var stack = Stack.prototype.create();
			stack.id = i;
			this.stacks.push( stack );
		}
		this.orderedStacks = [];
		this.orderedStacks.id = "orderedStacks";
		for( var i = 0; i < this.cardType.prototype.SUITS.length; i++ ) {
			this.orderedStacks.push( Stack.prototype.create() );
		}
		this.slots = [];
		this.slots.id = "slots";
		for( var i = 0; i < this.NUM_SLOTS; i++ ) {
			var slot = Stack.prototype.create();
			slot.id = i;
			this.slots.push( slot );
		}
		this.deck = Deck.prototype.create( this.cardType );
	},
	distribute: function() {
		while( this.deck.size() > this.NUM_STACKS ) {
			for( var i = 0; i < this.NUM_STACKS; i++ ) {
				this.stacks[ i ].pushCard( this.deck.popCard() );
			}
		}
		var numCardsLeft = this.deck.size();
		var i = 0;
		while( this.slots.length > numCardsLeft && this.deck.size() > 0 ) {
			this.slots[ i++ ].pushCard( this.deck.popCard() );
		}
		if( this.deck.size() > 0 ) {
			throw "Not enough slots and stacks to distribute cards.";
		}
	},
	isSuccessor: function( card1, card2 ) {
		return card1.suit() === card2.suit() && card1.value() - card2.value() === 1;
	},
	getDraggableCardsOnStack: function( stack ) {
		var cards = [];
		var lastCardOnStack = null;
		for( var j = stack.cards.length - 1; j >= 0; j-- ) {
			var card = stack.cards[ j ];
			if( j === stack.cards.length - 1 ) {
				cards.push( card );
				lastCardOnStack = card;
				continue;
			}
			if( this.isSuccessor( card, lastCardOnStack ) ) {
				cards.push( card );
				lastCardOnStack = card;
				continue;
			}
			break;
		}
		return cards;	
	},
	getDraggableCards: function() {
		var cards = [];
		for( var i = 0; i < this.slots.length; i++ ) {
			var slot = this.slots[ i ];
			if( slot.cards.length === 0 ) {
				continue;
			}
			cards.push( slot.cards[ 0 ] );
		}
		for( var i = 0; i < this.stacks.length; i++ ) {
			var stack = this.stacks[ i ];
			cards = cards.concat( this.getDraggableCardsOnStack( stack ) );
		}
		return cards;
	},
	getDroppableSlots: function() {
		var slots = [];
		for( var i = 0; i < this.slots.length; i++ ) {
			var slot = this.slots[ i ];
			if( slot.cards.length > 0 ) {
				continue;
			}
			slots.push( slot );
		}
		return slots;
	},
	getDroppableStacks: function() {
		return this.stacks;
	},
	isCardRemovable: function( card ) {
		if( !(card instanceof Card) ) {
			return false;	
		}
		var isAce = card.value() === 0;
		if( isAce ) {
			return true;
		}
		var orderedStack  = this.orderedStacks[ card.suit() ];
		var stackHasCards = orderedStack.size() > 0;
		if( !stackHasCards ) {
			return false;
		}
		return this.isSuccessor( card, orderedStack.peekCard() );
	},
	triggerCallbacks: function( cmd ) {
		for( var i = 0; i < this.callbacks.length; i++ ) {
			var callback = this.callbacks[ i ];
			callback.fn.apply( callback.scope, [ cmd ] );
		}
	},
	execute: function( cmd ) {
		this.triggerCallbacks( cmd );
		cmd.execute();
		this.commands.push( cmd );
		if( this.won() ) {
			for( var i = 0; i < this.winCallbacks.length; i++ ) {
				var winCallback = this.winCallbacks[ i ];
				winCallback.fn.apply( winCallback.scope, [] );
			}
		}
		this.order();
	},
	undo: function() {
		if( this.commands.length > 0 ) {
			var cmd = this.commands[ this.commands.length - 1 ];
			var undoCmd = Command.prototype.undo( cmd );
			this.triggerCallbacks( undoCmd );
			undoCmd.execute();
			this.commands.length--;
		} 
	},
	addListener: function( type, callback, scope ) {
		if( typeof callback !== "function" ) {
			throw "Invalid callback";
		}
		switch( type ) {
			case "step":
				this.callbacks.push({
					fn: callback,
					scope: scope
				});
				break;
			case "win":
				this.winCallbacks.push({
					fn: callback,
					scope: scope
				});
				break;
			default:
				throw "Invalid listener type";
		}
	},
	order: function() {
		var self = this, stacksArray = [ this.stacks, this.slots ];
		for( var j = 0; j < stacksArray.length; j++ ) {
			var currentStacks = stacksArray[ j ];
			for( var i = 0; i < currentStacks.length; i++ ) {
				var currentStack = currentStacks[ i ];
				if( currentStack.size() === 0 ) {
					continue;
				}
				var card = currentStack.peekCard();
				if( this.isCardRemovable( card ) ) {
					(function() {
						var toStack = self.orderedStacks.id;
						var indexTo = card.suit();
						var fromStack = currentStacks.id;
						var indexFrom = i; 
						var cmd = Command.prototype.create( 
							self, 
							1, 
							fromStack, 
							indexFrom, 
							toStack, 
							indexTo
						);
						self.execute( cmd );
						return;
					})();
				}
			}
		}
	},
	won: function() {
		for( var i = 0; i < this.orderedStacks.length; i++ ) {
			if( this.orderedStacks[ i ].size() !== this.cardType.prototype.VALUES.length ) {
				return false;
			}
		}
		return true;
	},
	create: function( cardType ) {
		return new Towers();
	}
};
