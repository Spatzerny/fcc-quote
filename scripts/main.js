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
			});
		};
	});
});