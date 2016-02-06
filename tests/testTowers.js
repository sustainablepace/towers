$(document).ready(function(){
    
	module("Towers", {
		setup: function() {
			this.game = Towers.prototype.create();
		},
		teardown: function() {
			this.game = null;
		},
		fakeDeck: function() {
			this.game.deck.cards = [];
			for( var i = 0; i < 6; i++ ) {
				this.game.deck.pushCard( Card.prototype.create( i ) );
			}
			for( var i = 51; i >= 6; i-- ) {
				this.game.deck.pushCard( Card.prototype.create( i ) );
			}
		}
	});


	test("Init", function() {
		deepEqual( this.game.stacks.length, 10 );
		deepEqual( this.game.orderedStacks.length, 4 );
		deepEqual( this.game.slots.length, 4 );
		deepEqual( this.game.deck.size(), 52 );
		for( var i = 0; i < this.game.stacks.length; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 0 );
		}
		for( var i = 0; i < this.game.orderedStacks.length; i++ ) {
			deepEqual( this.game.orderedStacks[ i ].size(), 0 );
		}
		for( var i = 0; i < this.game.slots.length; i++ ) {
			deepEqual( this.game.slots[ i ].size(), 0 );
		}
	});
	test("IDs", function() {
		equal( this.game.stacks.id, "stacks" );
		equal( this.game.orderedStacks.id, "orderedStacks" );
		equal( this.game.slots.id, "slots" );
		for( var i = 0; i < this.game.stacks.length; i++ ) {
			equal( this.game.stacks[ i ].id, i );
		}
		for( var i = 0; i < this.game.slots.length; i++ ) {
			equal( this.game.slots[ i ].id, i );
		}
	});
	test("Successor", function() {
		ok( this.game.isSuccessor( Card.prototype.create( 1 ), Card.prototype.create( 0 ) ) );
		ok( !this.game.isSuccessor( Card.prototype.create( 0 ), Card.prototype.create( 1 ) ) );

		ok( !this.game.isSuccessor( Card.prototype.create( 14 ), Card.prototype.create( 0 ) ) );
	});
	test("Distribute", function() {
		this.game.distribute();
		for( var i = 0; i < this.game.stacks.length; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 5 );
		}
		for( var i = 0; i < this.game.orderedStacks.length; i++ ) {
			deepEqual( this.game.orderedStacks[ i ].size(), 0 );
		}
		deepEqual( this.game.slots[ 0 ].size(), 1 );
		ok( this.game.slots[ 0 ].peekCard().id === 1 );
		deepEqual( this.game.slots[ 1 ].size(), 1 );
		ok( this.game.slots[ 1 ].peekCard().id === 0 );
		deepEqual( this.game.slots[ 2 ].size(), 0 );
		deepEqual( this.game.slots[ 3 ].size(), 0 );
	});
	test("getDraggableCards", function() {
		equal( this.game.getDraggableCards().length, 0 );

		this.game.distribute();

		equal( this.game.getDraggableCards().length, 12 );
	});
	test("getDroppableSlots", function() {
		equal( this.game.getDroppableSlots().length, 4 );

		this.game.distribute();

		equal( this.game.getDroppableSlots().length, 2 );
	});
	test("getDroppableStacks", function() {
		equal( this.game.getDroppableStacks().length, 10 );

		this.game.distribute();

		equal( this.game.getDroppableStacks().length, 10 );
	});
	test("fakeDeck", function() {
		this.fakeDeck();
		this.game.distribute();
		for( var i = 0; i < this.game.stacks.length; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 5 );
		}
		for( var i = 0; i < this.game.orderedStacks.length; i++ ) {
			deepEqual( this.game.orderedStacks[ i ].size(), 0 );
		}
		ok( this.game.stacks[ 9 ].peekCard().id === 2 );
		ok( this.game.stacks[ 8 ].peekCard().id === 3 );
		ok( this.game.stacks[ 7 ].peekCard().id === 4 );
		ok( this.game.stacks[ 6 ].peekCard().id === 5 );
		ok( this.game.stacks[ 5 ].peekCard().id === 51 );
		deepEqual( this.game.slots[ 0 ].size(), 1 );
		ok( this.game.slots[ 0 ].peekCard().id === 1 );
		deepEqual( this.game.slots[ 1 ].size(), 1 );
		ok( this.game.slots[ 1 ].peekCard().id === 0 );
		deepEqual( this.game.slots[ 2 ].size(), 0 );
		deepEqual( this.game.slots[ 3 ].size(), 0 );
	});
	test("Order", function() {
		this.fakeDeck();
		this.game.distribute();
		this.game.order();
		
		for( var i = 0; i < 6; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 5 );
		}
		for( var i = 6; i < 10; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 4 );
		}
		deepEqual( this.game.slots[ 0 ].size(), 0 );
		deepEqual( this.game.slots[ 1 ].size(), 0 );
		deepEqual( this.game.slots[ 2 ].size(), 0 );
		deepEqual( this.game.slots[ 3 ].size(), 0 );

		deepEqual( this.game.orderedStacks[ 0 ].size(), 6 );
		deepEqual( this.game.orderedStacks[ 1 ].size(), 0 );
		deepEqual( this.game.orderedStacks[ 2 ].size(), 0 );
		deepEqual( this.game.orderedStacks[ 3 ].size(), 0 );

		ok( !this.game.won() );
	});
	test("Listener", function() {
		raises( function() {
			this.game.addListener();
		}, "Expecting exception" );
		raises( function() {
			this.game.addListener(function() {});
		}, "Expecting exception, listener type missing" );
		raises( function() {
			this.game.addListener("gibbetnich", function() {});
		}, "Expecting exception, invalid listener type" );
		var cardsMoved = 0;
		this.game.addListener( "step", function() {
			cardsMoved++;
		});
		this.game.distribute();
		this.game.order();
		ok( cardsMoved === 52 );
	});
	test("Order instant win", function() {
		this.game.distribute();

		deepEqual( this.game.slots[ 0 ].size(), 1 );
		ok( this.game.slots[ 0 ].peekCard().id === Card.prototype.create( 1 ).id );
		deepEqual( this.game.slots[ 1 ].size(), 1 );
		ok( this.game.slots[ 1 ].peekCard().id === Card.prototype.create( 0 ).id );

		ok( this.game.stacks[ 9 ].peekCard().id === Card.prototype.create( 2 ).id );
		ok( this.game.stacks[ 8 ].peekCard().id === Card.prototype.create( 3 ).id );
		ok( this.game.stacks[ 7 ].peekCard().id === Card.prototype.create( 4 ).id );
		ok( this.game.stacks[ 6 ].peekCard().id === Card.prototype.create( 5 ).id );
		ok( this.game.stacks[ 5 ].peekCard().id === Card.prototype.create( 6 ).id );
		ok( this.game.stacks[ 4 ].peekCard().id === Card.prototype.create( 7 ).id );
		ok( this.game.stacks[ 3 ].peekCard().id === Card.prototype.create( 8 ).id );
		ok( this.game.stacks[ 2 ].peekCard().id === Card.prototype.create( 9 ).id );
		ok( this.game.stacks[ 1 ].peekCard().id === Card.prototype.create( 10 ).id );
		ok( this.game.stacks[ 0 ].peekCard().id === Card.prototype.create( 11 ).id );

		this.game.order();
		
		for( var i = 0; i < 10; i++ ) {
			deepEqual( this.game.stacks[ i ].size(), 0 );
		}
		for( var i = 0; i < 4; i++ ) {
			deepEqual( this.game.slots[ i ].size(), 0 );
		}
		for( var i = 0; i < this.game.orderedStacks.length; i++ ) {
			deepEqual( this.game.orderedStacks[ i ].size(), 13 );
		}
		ok( this.game.won() );
	});
});
