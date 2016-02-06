$(document).ready(function(){
    
	module("Stack");

	test("Init", function() {
		var stack = Stack.prototype.create();
		deepEqual( 0, stack.size() );	
	});
	test("Peek, push and pop", function() {
		var stack = Stack.prototype.create();
		raises( function() {
			stack.peekCard();
		});

		var deck = Deck.prototype.create( Card );
		for( var i = 0; i < 10; i++ ) {
			stack.pushCard( deck.popCard() );
		}
		var card = Card.prototype.create( 42 );
		ok( stack.peekCard().equals( card ) );

		deepEqual( 10, stack.size() );	
		deepEqual( 42, deck.size() );
		for( var i = 0; i < 10; i++ ) {
			stack.popCard();
		}
		deepEqual( 0, stack.size() );	
	});
});

