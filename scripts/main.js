$('document').ready(function() {
	var quoteHtmlString, firstQuote, firstQuoteHeight, printerReady = true;
	
	$('#btn-go').click(function() {
		if (printerReady) {
			printerReady = false;
			$.getJSON('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?', function(json) {
				
				if (!json.quoteAuthor) {json.quoteAuthor = 'Anonymous'}; 
				
				quoteHtmlString = '<section class="quote-wrapper"><p class="quote">'
					+ json.quoteText + '</p><p class="author">'
					+ json.quoteAuthor + '</p></section>';
				
				$('#printer').prepend(quoteHtmlString);
				
				//this is all for the needlessly specific animation
				printedQuote = $('.quote-wrapper:first-child');
				printedQuoteHeight = parseInt(printedQuote.css('height'));
				printedQuote.find('.quote').css('margin-top', ((printedQuoteHeight) * -1)-10);
				printedQuote.find('.quote').animate({
					marginTop: '20px'
				}, printedQuoteHeight * 10, 'linear', function() {
					printerReady = true;
					printedQuote.addClass('draggable');
				});			
			}).fail(function(json){
				printerReady = true;
			});
		};
	});
	
	//drag and drop START
	$('body').on('mousedown', '.draggable', function(downEvent) {
		var thisElement = $(this); 
		var xOffset = thisElement.offset().left - downEvent.pageX + thisElement.width()/2;
		var yOffset = thisElement.offset().top - downEvent.pageY + thisElement.height()/2;

		thisElement.css({
			position: 'absolute',
			width: thisElement.width(),
			//change the left/top on start to begin 'in hand'
			left: downEvent.pageX - thisElement.width()/2 + xOffset,
			top: downEvent.pageY - thisElement.height()/2 + yOffset
		});

		thisElement.appendTo('body');

		$('body').on('mousemove', (function(moveEvent) {
			thisElement.css({
				left: moveEvent.pageX - thisElement.width()/2 + xOffset,
				top: moveEvent.pageY - thisElement.height()/2 + yOffset
			});
		}));

		$('body').mouseup(function(){
			$('body').off('mousemove');
		});
	});
	//drag and drop END
	
});