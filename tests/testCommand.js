$(document).ready(function(){
    
	module("Command", {
		setup: function() {
			var deck = Deck.prototype.create( Card );
			this.stacks1 = [ Stack.prototype.create() ];
			this.stacks1.id = "stacks1";
			this.stacks2 = [ Stack.prototype.create() ];
			this.stacks2.id = "stacks2";
			for( var i = 0; i < 15; i++ ) {
				this.stacks1[ 0 ].pushCard( deck.popCard() );
			}
		},
		teardown: function() {
			this.stacks1 = null;
			this.stacks2 = null;
		}
	});

	test("Insufficient cards on stack", function() {
		raises( function() {
			var cmd = Command.prototype.create( this, 99, this.stacks1.id, 0, this.stacks2, 0 );
			cmd.execute();
		});
		raises( function() {
			var cmd = Command.prototype.create( this, -1, this.stacks1.id, 0, this.stacks2, 0 );
			cmd.execute();
		});
	});
	test("Init", function() {
		var numMovedCards = 5;
		var movedCards = this.stacks1[0].cards.slice( -1 * numMovedCards );
		var origSize = this.stacks1[0].size();

		var cmd = Command.prototype.create( this, numMovedCards, this.stacks1.id, 0, this.stacks2.id, 0 );
		cmd.execute();

		deepEqual( this.stacks1[0].size(), origSize - numMovedCards );	
		deepEqual( this.stacks2[0].size(), numMovedCards );
		for( var i = 0; i < numMovedCards; i++ ) {
			ok( Card.prototype.isValidId( this.stacks2[0].cards[ i ].id ) );
			deepEqual( this.stacks2[0].cards[ i ].id, movedCards[ i ].id );
		}

		Command.prototype.undo( cmd ).execute();

		deepEqual( this.stacks1[0].size(), origSize );	
		deepEqual( this.stacks2[0].size(), 0 );
		for( var i = 0; i < numMovedCards; i++ ) {
			var index = origSize - i - 1;
			ok( Card.prototype.isValidId( this.stacks1[0].cards[ index ].id ) );
			deepEqual( this.stacks1[0].cards[ index ].id, movedCards[ numMovedCards - i - 1 ].id );
		}
	});
});

