/*TODO
print out if api call fails
DRY drag and drop desktop and mobile
*/

function isNearBox(quoteSheet) {
	var radius = 10;
	var quoteSheetX = quoteSheet.offset().left;
	var quoteSheetY = quoteSheet.offset().top + quoteSheet.height();
	
	var nearbyBox = $('.box').filter(function() {
		var boxX = $(this).find('.box-slot').offset().left;
		var boxY = $(this).find('.box-slot').offset().top;
		
		if (quoteSheetX - boxX < radius &&
				quoteSheetY - boxY < radius &&
				quoteSheetX - boxX > -radius &&
				quoteSheetY - boxY > -radius) {
			return true;
		} else {
			return false;
		}
	}).first();
	
	if (nearbyBox.length === 0) {
		return false;
	} else {
		return nearbyBox;
	}
};

function makeQuoteSheet(json) {
	if (!json.quoteAuthor) {json.quoteAuthor = 'Anonymous'}; 
	return $('<section class="quote-wrapper"><p class="quote">'
					+ json.quoteText + '</p><p class="author">'
					+ json.quoteAuthor + '</p></section>')
}

$('document').ready(function() {
	var apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?';
	var printerReady = true;
	var printedQuote;
	var printedQuoteHeight;
	
	//BUTTON
	$('#btn-go').click(function() {
		if (printerReady) {
			printerReady = false;
			$.getJSON(apiUrl, function(json) {
				
				makeQuoteSheet(json).prependTo($('#printer'));
				
				//this is all for the specific animation (same speed regardless of element height)
				printedQuote = $('.quote-wrapper:first-child');
				printedQuoteHeight = parseInt(printedQuote.css('height'));
				printedQuote.find('.quote').css('margin-top', -printedQuoteHeight - 10);
				printedQuote.find('.quote').animate({
					marginTop: '20px'
				}, printedQuoteHeight * 10, 'linear', function() {
					printedQuote.addClass('draggable');
					printerReady = true;
				});
				
			}).fail(function(json){
				$('<section class="quote-wrapper"><p class="quote">Api failure, try again? Maybe? I don\'t have quotes of my own :(...</p><p class="author">...halp?</p></section>').prependTo($('#printer'));
				
				printedQuote = $('.quote-wrapper:first-child');
				printedQuoteHeight = parseInt(printedQuote.css('height'));
				printedQuote.find('.quote').css('margin-top', -printedQuoteHeight - 10);
				printedQuote.find('.quote').animate({
					marginTop: '20px'
				}, printedQuoteHeight * 10, 'linear', function() {
					printedQuote.addClass('draggable');
					printerReady = true;
				});
			});
		};
	});
	
	//DRAG AND DROP
	$('body').on('mousedown', '.draggable', function(downEvent) {
		var thisElement = $(this); 
		var xOffset = thisElement.offset().left - downEvent.pageX + thisElement.width()/2;
		var yOffset = thisElement.offset().top - downEvent.pageY + thisElement.height()/2;

		//PICK
		thisElement.css({
			position: 'absolute',
			//change the width to fixed because it's gonna be moved out of the parent
			width: thisElement.width(),
			//set the position once on start to begin 'in hand'
			left: downEvent.pageX - thisElement.width()/2 + xOffset,
			top: downEvent.pageY - thisElement.height()/2 + yOffset
		});

		thisElement.appendTo('body');
		
		//DRAG
		$('body').on('mousemove', (function(moveEvent) {
			thisElement.css({
				left: moveEvent.pageX - thisElement.width()/2 + xOffset,
				top: moveEvent.pageY - thisElement.height()/2 + yOffset
			});
		}));
		
		//DROP
		$('body').mouseup(function(){
			if (isNearBox(thisElement)) {
				printedQuote = thisElement;
				printedQuoteHeight = parseInt(printedQuote.css('height'));
				printedQuote.find('.quote').css('margin-bottom', '20px');
				
				printedQuote.animate({
					left: isNearBox(thisElement).find('.box-slot').offset().left + parseInt( isNearBox(thisElement).find('.box-slot').css('padding'), 10 ),
					top: isNearBox(thisElement).find('.box-slot').offset().top - printedQuoteHeight + parseInt( isNearBox(thisElement).find('.box-slot').css('padding'), 10 )
				}, 100, function(){
					printedQuote.animate({
						marginTop: printedQuoteHeight,
						height: 0
					}, printedQuoteHeight * 10, 'linear', function() {
						$(this).remove();
					});
				});
			};
			$('body').off('mousemove');
			$('body').off('mouseup');
		});
		
	});
	
	/*
	//drag and drop CRUDE MOBILE
	$('body').on('touchstart', '.draggable', function(downEvent) {
		console.log(downEvent.originalEvent.changedTouches[0].pageX);
		downEvent.preventDefault();
		var thisElement = $(this); 
		var xOffset = thisElement.offset().left - downEvent.originalEvent.changedTouches[0].pageX + thisElement.width()/2;
		var yOffset = thisElement.offset().top - downEvent.originalEvent.changedTouches[0].pageY + thisElement.height()/2;

		thisElement.css({
			position: 'absolute',
			width: thisElement.width(),
			//change the left/top on start to begin 'in hand'
			left: downEvent.originalEvent.changedTouches[0].pageX - thisElement.width()/2 + xOffset,
			top: downEvent.originalEvent.changedTouches[0].pageY - thisElement.height()/2 + yOffset
		});

		thisElement.appendTo('body');

		$('body').on('touchmove', (function(moveEvent) {
			thisElement.css({
				left: moveEvent.originalEvent.changedTouches[0].pageX - thisElement.width()/2 + xOffset,
				top: moveEvent.originalEvent.changedTouches[0].pageY - thisElement.height()/2 + yOffset
			});
		}));

		$('body').on('touchend',function(){
			$('body').off('touchmove');
		});
	});
	*/
});