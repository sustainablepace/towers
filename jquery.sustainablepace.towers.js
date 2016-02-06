(function( $ ) {
	$.widget( "sustainablepace.towers", {
		_CLASS_ORDEREDSTACKS : "towers-ordered-stack",
		_CLASS_SLOTS : "towers-slot",
		_CLASS_STACKS : "towers-stack",
 		options: { 
		},
		_create: function() {
			var self = this;
//			$( window ).bind( "keyup", function( evt ) {
//				if( evt.keyCode === 85 || evt.keyCode === 117 ) {
//					self.game.undo();
//				}			
//			});
			$( window ).bind( "keyup", function( evt ) {
				if( evt.keyCode === 71 || evt.keyCode === 103 ) {
					self._giveUp();
				}			
			});
			$( window ).bind( "keyup", function( evt ) {
				if( evt.keyCode === 83 || evt.keyCode === 115 ) {
					alert( self._stats() );
				}			
			});
			$( window ).bind( "keyup", function( evt ) {
				if( evt.keyCode === 82 || evt.keyCode === 114 ) {
					if( confirm( "Reset stats?" ) ) {
						self._won = 0;
						self._lost = 0;
						self._setStats();
					}
				}			
			});
			if( typeof localStorage === "object" ) {
				var won = parseInt( localStorage.getItem( "won" ), 10 );
				var lost = parseInt( localStorage.getItem( "lost" ), 10 );
				if( !isNaN( won ) && won > 0 ) {
					this._won = won;
				}
				if( !isNaN( lost ) && lost > 0 ) {
					this._lost = lost;
				}
			}

		},
		_setStats: function() {
			if( typeof localStorage === "object" ) {
				localStorage.setItem( "won", this._won );
				localStorage.setItem( "lost", this._lost );
			}
		},
		_won: 0,
		_lost: 0,
		_init: function() {
			this._setStats();
			this.game = Towers.prototype.create();
			this.game.addListener( "step", this.callback, this );
			this.game.addListener( "win", this.winCallback, this );
			this.game.deck.shuffle();
			this.game.distribute();

			this._createView();
			this.game.order();

			var self = this;
			setTimeout( function() {
				self._initDragHandlers();
				self._initDropHandlers();
			}, 0 );
		},
		_getStacksClass: function( stacksName ) {
			return "towers-" + stacksName.replace(/([A-Z])/g, "-$1").toLowerCase();
		},
		_getStackByClassAndIndex: function( cls, index ) {
			return $( "." + cls ).children( "li" ).eq( index );
		},
		_removeDraggable: function( cmd, container ) {
			if( cmd.toStackName === "orderedStacks" ) {
				this._makeNotDraggable( container ); // ok; kann immer nur eine Karte sein
			}
		},
		_removeDroppable: function( cmd, toStack ) {
			if( cmd.toStackName === "slots" ) {
				this._makeNotDroppable( toStack );
			}
			if( cmd.toStackName === "stacks" ) {
				var numCardsOnToStack = this.game[ cmd.toStackName ][ cmd.toStackIndex ].cards.length;
				if( numCardsOnToStack === 0 ) {
					this._makeNotDroppable( toStack );
				} else {
					var lastCardOnStack = toStack.find( "span.card" ).eq( numCardsOnToStack - 1 );
					this._makeNotDroppable( lastCardOnStack );
				}
			}
		},
		_addDraggable: function( cmd, fromStack, containers ) {
			if( cmd.fromStackName === "stacks" ) {
				if( cmd.numCards === containers.size() ) {
					return; // alle Karten verschoben, keine Karte mehr auf Stack
				}
				var stack = this.game[ cmd.fromStackName ][ cmd.fromStackIndex ];
				var startIndex = stack.cards.length - cmd.numCards - 1;
				for( var i = startIndex; i >= 0; i-- ) {
					if( i < startIndex && !this.game.isSuccessor( stack.cards[ i ], stack.cards[ i + 1 ] ) ) {
						break;						
					}
					var container = containers.eq( i );
					this._makeDraggable( container );
				}				
			}
		},
		_addDroppable: function( cmd, fromStack, containers ) {
			if( cmd.fromStackName === "slots" ) {
				this._makeSlotDroppable( fromStack );
				if( cmd.toStackName === "stacks" ) {
					var lastContainerOnStack = containers.eq( containers.size() - cmd.numCards - 1 );
					this._makeCardDroppable( this._getCardByContainer( lastContainerOnStack ) );
				}
			}
			if( cmd.fromStackName === "stacks" ) {
				if( cmd.numCards === containers.size() ) {
					this._makeEmptyStackDroppable( fromStack );
					return; // alle Karten verschoben, keine Karte mehr auf Stack
				}
				var lastContainerOnStack = containers.eq( containers.size() - cmd.numCards - 1 );
				this._makeCardDroppable( this._getCardByContainer( lastContainerOnStack ) );
			}
		},
		_stats: function() {
			return this._won + " wins, " + this._lost + " losses.";
		},
		winCallback: function() {
			alert( "You won!" );
			this._won++;
			this._init();
		},
		_giveUp: function() {
			if( !confirm( "Do you want to give up?" ) ) {
				return;
			}
			this._lost++;
			this._init();
		},
		_moveCardsByCommand: function( cmd ) {
			var fromStackClass = this._getStacksClass( cmd.fromStackName );
			var toStackClass   = this._getStacksClass( cmd.toStackName );
			var fromStack      = this._getStackByClassAndIndex( fromStackClass, cmd.fromStackIndex );
			var toStack        = this._getStackByClassAndIndex( toStackClass, cmd.toStackIndex );
			var containers = fromStack.find( "div.towers-stack-container" );
			if( cmd.numCards > containers.size() ) {
				throw "Insufficient cards on view.";
			}
			var container = containers.eq( containers.size() - cmd.numCards );

			this._removeDraggable( cmd, container );
			this._removeDroppable( cmd, toStack );
			this._addDraggable( cmd, fromStack, containers );
			this._addDroppable( cmd, fromStack, containers );





			container.css({
				top: 0,
				left: 0
			});
			// Auf leeren Stack schieben
			var numCardsOnToStack = this.game[ cmd.toStackName ][ cmd.toStackIndex ].cards.length;
			if( numCardsOnToStack === 0 ) {
				toStack.append( container );
			// Auf vollen Stack schieben
			} else {
				var lastCardOnStack = toStack.find( "div.towers-stack-container" ).eq( numCardsOnToStack - 1 );
				lastCardOnStack.append( container );
			}
			
		},
		_isDraggable: function( el ) {
			return el.data( "draggable" );
		},
		_makeNotDraggable: function( el ) {
			if( this._isDraggable( el ) ) {
				el.draggable( "destroy" );
			}
		},
		_makeDraggable: function( el ) {
			if( !this._isDraggable( el ) ) {
				el.draggable({
					revert: 'invalid',
					revertDuration: 200,
					zIndex: 10
				});
			}
		},
		_isDroppable: function( el ) {
			return el.data( "droppable" );
		},
		_getStackName: function( el ) {
			return el.attr( "class" ).match(/slot/) ? "slots" : "stacks";
		},
		_getStackByDraggable: function( el ) {
			return el.parents( "li" ).eq( 0 );
		},
		_getNumCardsByDraggable: function( el ) {
			return el.find( "span.card" ).size();
		},
		_drop: function( draggable, droppable ) {
			var numCards       = this._getNumCardsByDraggable( draggable );
			var fromStack      = this._getStackByDraggable( draggable );
			var fromStackName  = this._getStackName( fromStack );
			var fromStackIndex = fromStack.prevAll( "li" ).size();
			var toStackName    = this._getStackName( droppable );
			var toStack        = droppable.get( 0 ).tagName.toUpperCase() === "LI" ? 
				droppable : droppable.parents( "li" ).eq( 0 );
			var toStackIndex   =  toStack.prevAll( "li" ).size();

			var cmd = Command.prototype.create( 
				this.game, 
				numCards, 
				fromStackName, 
				fromStackIndex, 
				toStackName, 
				toStackIndex
			);
			this.game.execute( cmd );
		},
		_makeSlotDroppable: function( el ) {
			if( this._isDroppable( el ) ) {
				return;
			}
			var self = this;
			el.droppable({
				accept: function( cardContainer ) {
					return self._getNumCardsByDraggable( cardContainer ) === 1;
				},
				drop: function( event, ui ) {
					self._drop( ui.draggable, $( this ) );
				}
			});
		},
		_tooFewEmptySlots: function( draggedCardContainer ) {
			var numEmptySlots = 0;
			for( var i = 0; i < this.game.slots.length; i++ ) {
				if( this.game.slots[ i ].cards.length === 0 ) {
					numEmptySlots++;
				}
			}
			var numCardsInContainer = draggedCardContainer.find( "span.card" ).size();

			return numCardsInContainer > numEmptySlots + 1;
		},
		_makeEmptyStackDroppable: function( el ) {
			if( this._isDroppable( el ) ) {
				return;
			}
			var self = this;
			el.droppable({
				accept: function( cardContainer ) {
					if( self._tooFewEmptySlots( cardContainer ) ) {
						return false;
					}
					var draggableCardspan = self._getCardByContainer( cardContainer );
					var draggableCard = self._getCardByCardSpan( draggableCardspan );
					return draggableCard.valueName() === "king";
				},
				drop: function( event, ui ) {
					self._drop( ui.draggable, $( this ) );
				}
			});
		},
		_makeCardDroppable: function( el ) {
			if( this._isDroppable( el ) ) {
				return;
			}
			var self = this;
			var card = this._getCardByCardSpan( el );
			el.droppable({
				accept: function( cardContainer ) {
					if( self._tooFewEmptySlots( cardContainer ) ) {
						return false;
					}
					var draggableCardspan = self._getCardByContainer( cardContainer );
					var draggableCard = self._getCardByCardSpan( draggableCardspan );
					return self.game.isSuccessor( card, draggableCard );
				},
				drop: function( event, ui ) {
					self._drop( ui.draggable, $( this ) );
				}
			});
		},
		_makeNotDroppable: function( el ) {
			if( this._isDroppable( el ) ) {
				el.droppable( "destroy" );
			}
		},
		_getCardByContainer: function( el ) {
			var cards = el.find( "span.card" );
			if( cards.size() === 0 ) {
				console.log( el );
				throw "No card in container.";
			}
			return cards.eq( 0 );
		},
		_getContainerByCard: function( el ) {
			var cards = el.parent().parent( "div.towers-stack-container" );
			if( cards.size() === 0 ) {
				throw "No container for card.";
			}
			return cards.eq( 0 );
		},
		_getCardByCardSpan: function( span ) {
			var cls = span.attr( "class" );
			var id = cls.replace(/[\s\w]+card\-([\w]+\-[\w]+)[\s\w\-]*/g, "$1");
			return Card.prototype.create( id );
		},
		_getCardSpanByCard: function( card ) {
			var cls = "card-" + card.suitName() + "-" + card.valueName();
			return $( "span." + cls );
		},
		_initDragHandlers: function() {
			var draggableCards = this.game.getDraggableCards();
			for( var i = 0; i < draggableCards.length; i++ ) {
				var cardSpan = this._getCardSpanByCard( draggableCards[ i ] );
				this._makeDraggable( this._getContainerByCard( cardSpan ) );
			}
		},
		_getSlot: function( i ) {
			return $( "li.towers-slot" ).eq( i );
		},
		_initDropHandlers: function() {
			var self = this; 
			var droppableSlots = this.game.getDroppableSlots();
			for( var i = 0; i < droppableSlots.length; i++ ) {
				var slot = droppableSlots[ i ];
				var s = this._getSlot( slot.id );
				this._makeSlotDroppable( s );
			}
			var droppableStacks = this.game.getDroppableStacks();
			for( var i = 0; i < droppableStacks.length; i++ ) {
				(function() {
					var stack = droppableStacks[ i ];
					var droppable = $( "li.towers-stack" ).eq( i );
					if( stack.cards.length > 0 ) {
						var cardOnTop = stack.cards[ stack.cards.length - 1 ];
						droppable = droppable.find( self._getCardSelectorByCard( cardOnTop ) );
					}
					self._makeCardDroppable( droppable );
				})();
			}
		},
		callback: function( cmd ) {
			this._moveCardsByCommand( cmd );
		},
 		_setOption: function( key, value ) {
			switch( key ) {
			}
			$.Widget.prototype._setOption.apply( this, arguments );
		},
		destroy: function() {
			$.Widget.prototype.destroy.call( this );
			this.element.empty();
		},
		_createView: function() {
			this.element.empty();
			var stacks = {};
			stacks[ this._CLASS_ORDEREDSTACKS ] = this.game.orderedStacks;
			stacks[	this._CLASS_SLOTS ] = this.game.slots;
			stacks[	this._CLASS_STACKS ] = this.game.stacks;

			for( var i in stacks ) {
				this._createStacksView( i, stacks[ i ] );
			}
		},
		_getCardSelectorByCard: function( card ) {
			return "span." + this._getCardClassByCard( card );
		},
		_getCardClassByCard: function( card ) {
			return "card-" + card.suitName() + "-" + card.valueName();
		},
		_createCardView: function( card ) {
			return $( "<span></span>" )
				.addClass( "card" )
				.addClass( this._getCardClassByCard( card ) );
		},
		_createStackedCardView: function( card ) {
			var container = $( "<div></div>" ).addClass( "towers-stack-container" );
			var stackedCard = $( "<div></div>" ).addClass( "towers-stacked-card" );
			stackedCard.append( this._createCardView( card ) );
			container.append( stackedCard );
			return container;
		},
		_createStackView: function( cls, stacks, i ) {
			var stackView = $( "<li></li>" ).addClass( cls );
			var cardView = null;
			for( var j = 0; j < stacks[ i ].cards.length; j++ ) {
				var card = stacks[ i ].cards[ j ];
				if( cardView === null ) {
					cardView = this._createStackedCardView( card );
					stackView.append( cardView );
					continue;
				}
				var nextCardView = this._createStackedCardView( card );
				cardView.append( nextCardView );
				cardView = nextCardView;
			}
			return stackView;
		},
		_createStacksView: function( cls, stacks ) {
			var stacksView = $( "<ul></ul>" ).addClass( cls + "s" );
			for( var i = 0; i < stacks.length; i++ ) {
				var stackView = this._createStackView( cls, stacks, i );				
				stacksView.append( stackView );
			}
			this.element.append( stacksView );
		}
	});
}( jQuery ) );


