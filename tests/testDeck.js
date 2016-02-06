$(document).ready(function(){
    
	module("Deck");

	test("Invalid card constructor", function() {
		raises( function() {
			var deck = Deck.prototype.create();
		}, "Invalid card constructor");
	});
	test("Number of cards", function() {
		var deck = Deck.prototype.create( Card );
		deepEqual( deck.cards.length, 52 );
	});
	test("Name", function() {
		var deck = Deck.prototype.create( Card );
		deepEqual( "ace of clubs, two of clubs, three of clubs, four of clubs, five of clubs, six of clubs, seven of clubs, eight of clubs, nine of clubs, ten of clubs, jack of clubs, queen of clubs, king of clubs, ace of spades, two of spades, three of spades, four of spades, five of spades, six of spades, seven of spades, eight of spades, nine of spades, ten of spades, jack of spades, queen of spades, king of spades, ace of hearts, two of hearts, three of hearts, four of hearts, five of hearts, six of hearts, seven of hearts, eight of hearts, nine of hearts, ten of hearts, jack of hearts, queen of hearts, king of hearts, ace of diamonds, two of diamonds, three of diamonds, four of diamonds, five of diamonds, six of diamonds, seven of diamonds, eight of diamonds, nine of diamonds, ten of diamonds, jack of diamonds, queen of diamonds, king of diamonds", deck + "" );
	});
	test("Shuffle", function() {
		expect( 55 );		
		var deck = Deck.prototype.create( Card );
		var str = deck + "";		
		deck.shuffle();
		deepEqual( deck.size(), 52 );
		notDeepEqual( str, deck + "" );
		deepEqual( (deck + "").match(/,/g).length, 51 );
		for( var i = 0; i < deck.size(); i++ ) {
			deepEqual( (deck + "").match( new RegExp( deck.cards[ i ] + "", "g" ) ).length, 1 );
		}
	});
	test("pop", function() {
		var deck = Deck.prototype.create( Card );
		var card = deck.popCard();
		ok( card instanceof Card );
		ok( card.equals( Card.prototype.create( 51 ) ) );
		deepEqual( deck.size(), 51 );		
	});
	test("reverse", function() {
		var deck = Deck.prototype.create( Card );
		deck.cards.reverse();
		var card = deck.popCard();
		ok( card instanceof Card );
		ok( card.equals( Card.prototype.create( 0 ) ) );
		deepEqual( deck.size(), 51 );		
	});
});

