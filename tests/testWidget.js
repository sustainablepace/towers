$(document).ready(function(){
    
	module("Widget", {
		setup: function() {
			$( "#qunit-fixture" ).append( "<div id='towers'></div>" );
			$( "#towers" ).towers();
		},
		teardown: function() {
		}
	});

	test("Init", function() {
		var container = $("#towers");
		ok( container.size() === 1 );
		ok( container.children().size() === 3 );
		var orderedStacks = container.children( "ul.towers-ordered-stacks" );		
		var slots = container.children( "ul.towers-slots" );		
		var stacks = container.children( "ul.towers-stacks" );		
		ok( orderedStacks.size() === 1 );
		ok( slots.size() === 1 );
		ok( stacks.size() === 1 );
		ok( orderedStacks.children( "li" ).size() === 4 );
		ok( slots.children( "li" ).size() === 4 );
		ok( stacks.children( "li" ).size() === 10 );
		var widget = container.data( "towers" );
		var game = widget.game;
		for( var i = 0; i < game.stacks.length; i++) {
			var stack = game.stacks[ i ];
			ok( stack.cards.length === stacks.children( "li" ).eq( i ).find( ".card" ).size() );
		}
		for( var i = 0; i < game.orderedStacks.length; i++) {
			var stack = game.orderedStacks[ i ];
			ok( stack.cards.length === orderedStacks.children( "li" ).eq( i ).find( ".card" ).size() );
		}
		for( var i = 0; i < game.slots.length; i++) {
			var stack = game.slots[ i ];
			ok( stack.cards.length === slots.children( "li" ).eq( i ).find( ".card" ).size() );
		}
	});
});
