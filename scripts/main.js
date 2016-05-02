$('document').ready(function() {
	var quoteHtmlString, firstQuote, firstQuoteHeight, ready = true;
	
	$('#btn-go').click(function() {
		if (ready) {
			ready = false;
			$.getJSON('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?', function(json) {
				
				if (!json.quoteAuthor) {json.quoteAuthor = 'Anonymous'}; 
				
				quoteHtmlString = '<section class="quote-wrapper"><p class="quote">'
					+ json.quoteText + '</p><p class="author">'
					+ json.quoteAuthor + '</p></section>';
				
				$('#mouth').prepend(quoteHtmlString);

				firstQuote = $('.quote-wrapper:first-child');
				firstQuoteHeight = parseInt(firstQuote.css('height'));
				firstQuote.find('.quote').css('margin-top', ((firstQuoteHeight) * -1)-10);
				firstQuote.find('.quote').animate({
					marginTop: '20px'
				}, firstQuoteHeight * 10, 'linear', function() {
					ready = true;
				});			
				
				//drag and drop START
				$('body').on('mousedown', '.quote-wrapper', function(downEvent) {
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
						$('body').off('mousemove')
					});
				});
				//drag and drop END
				
			}).fail(function(json){
				ready = true;
			});
		};
	});

});