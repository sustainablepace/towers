$(document).ready(function(){
    
	module("Card");

	test("Valid id", function() {
		var card1 = Card.prototype.create( 0 );
		deepEqual( card1.id, 0 );

		var card2 = Card.prototype.create( 1 );
		deepEqual( card2.id, 1 );

		deepEqual( card1.id, 0 );

		var card3 = Card.prototype.create( "clubs-ace" );
		deepEqual( card3.id, 0 );			

		var card4 = Card.prototype.create( "diamonds-king" );
		deepEqual( card4.id, 51 );			
	});
	test("Fails with invalid id", function() {
		raises( function() {
			var card = Card.prototype.create();
		}, "Expecting exception" );
		raises( function() {
			var card = Card.prototype.create( "a" );
		}, "Expecting exception" );
		raises( function() {
			var card = Card.prototype.create( -1 );
		}, "Expecting exception" );
		raises( function() {
			var card = Card.prototype.create( 52 );
		}, "Expecting exception" );
	});

	test("Valid suit", function() {
		var card1 = Card.prototype.create( 13 );
		deepEqual( card1.suit(), 1 );

	});
	test("Valid value", function() {
		var card1 = Card.prototype.create( 13 );
		deepEqual( card1.value(), 0 );

	});
	test("Valid name", function() {
		var card1 = Card.prototype.create( 0 );
		deepEqual( card1 + "", "ace of clubs" );

		var card2 = Card.prototype.create( 13 );
		deepEqual( card2 + "", "ace of spades" );

		var card3 = Card.prototype.create( 24 );
		deepEqual( card3 + "", "queen of spades" );

		var card4 = Card.prototype.create( 51 );
		deepEqual( card4 + "", "king of diamonds" );

	});
	test("Equals", function() {
		var card1 = Card.prototype.create( 0 );
		var card2 = Card.prototype.create( 0 );

		ok( card1.equals( card2 ) );

		var card3 = Card.prototype.create( 1 );
		ok( !card1.equals( card3 ) );

	});
});

