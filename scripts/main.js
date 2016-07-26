/*TODO
social media functionality
starting positions of boxes
change cursor on movement (to hand?)
diode for printer availibility?
DRY drag and drop desktop and mobile
personal info
*/

function makeSheet(main, sub) {
	return $('<section class="quote-sheet"><p class="quote">'
					+ main
					+ '</p><p class="author">'
					+ sub
					+ '</p></section>');
}

function isNearBox(sheet) {
	var radius = 10;
	var sheetX = sheet.offset().left;
	var sheetY = sheet.offset().top + sheet.height();
	
	var nearBox = $('.box').filter(function() {
		var boxX = $(this).find('.box-slot').offset().left;
		var boxY = $(this).find('.box-slot').offset().top;
		
	if (sheet.hasClass('paper')) {
		
	}
		
	if (Math.abs(sheetX - boxX) < radius && Math.abs(sheetY - boxY) < radius) {
			return true;
		} else {
			return false;
		}
	}).first();
	
	if (nearBox.length === 0) {
		return false;
	} else {
		return nearBox;
	};
};

$('document').ready(function() {
	
	//PRINTER && PRINTER BUTTON
	$('#btn-go').click(function() {
		var apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?';
		var printReady = true;
		var printSheet;
		var printSheetHeight;
		
		if (printReady) {
			printReady = false;
			$.getJSON(apiUrl, function(json){
				if (!json.quoteAuthor) {
					json.quoteAuthor = 'Anonymous'
				}; 
				makeSheet(json.quoteText, json.quoteAuthor).prependTo($('#printer'));
			})
				.fail(function(json){
				makeSheet('API error...', '...sorry :(').prependTo($('#printer'));
			})
				.always(function(json) {
				//animation (same speed regardless of element height)
				printSheet = $('.printer-slot > .quote-sheet:first-child');
				printSheetHeight = parseInt(printSheet.css('height'));
				printSheet.find('.quote').css('margin-top', -printSheetHeight - 10);
				printSheet.find('.quote').animate({
					marginTop: '20px'
				}, printSheetHeight * 10, 'linear', function() {
					printSheet.addClass('draggable');
					printReady = true;
				});
			});
		};
	});
	
	//DRAG AND DROP
	$('body').on('mousedown', '.draggable', function(downEvent) {
		downEvent.preventDefault();
		var draggedElement = $(this); 
		var xOffset = draggedElement.offset().left - downEvent.pageX + draggedElement.width()/2;
		var yOffset = draggedElement.offset().top - downEvent.pageY + draggedElement.height()/2;

		//PICK
		draggedElement.css({
			position: 'absolute',
			width: draggedElement.width(),
			left: downEvent.pageX - draggedElement.width()/2 + xOffset,
			top: downEvent.pageY - draggedElement.height()/2 + yOffset
		});

		draggedElement.appendTo('body');
		
		//DRAG
		$('body').on('mousemove', function(moveEvent) {
			var lastNearBox;
			lastNearBox = isNearBox(draggedElement);
			if (lastNearBox && draggedElement.hasClass('quote-sheet')) {
				lastNearBox.find('.box-slot').css('background-color', '#ddd');	
			} else {
				$('.box .box-slot').css('background-color', '#555');
			}
			draggedElement.css({
				left: moveEvent.pageX - draggedElement.width()/2 + xOffset,
				top: moveEvent.pageY - draggedElement.height()/2 + yOffset
			});
		});
		
		//DROP
		$('body').on('mouseup', function(){
			var nearBox = isNearBox(draggedElement);
			
			if (nearBox && draggedElement.hasClass('quote-sheet')) {
				var nearBoxSlot = nearBox.find('.box-slot');
				var nearBoxSlotPadding = parseInt(nearBoxSlot.css('padding'));					 
				var draggedHeight = parseInt(draggedElement.css('height'));
				
				draggedElement.find('.quote').css('margin-bottom', '20px');
				draggedElement.animate({
					left: nearBoxSlot.offset().left + nearBoxSlotPadding,
					top: nearBoxSlot.offset().top + nearBoxSlotPadding - draggedHeight
				}, 100, function(){
					draggedElement.prependTo(nearBoxSlot);
					draggedElement.css({
						left: nearBoxSlotPadding,
						top: nearBoxSlotPadding - draggedHeight
					});
					draggedElement.animate({
						marginTop: draggedHeight,
						height: 0
					}, draggedHeight * 10, 'linear', function() {
						if (nearBox.hasClass('box-twitter')) {
																window.open('https://twitter.com/intent/tweet?text='
																+$(this).find('.quote').text()
																+'&url=https://spatzerny.github.io/fcc-quote',"myWindow","height=600,width=900",'modal=yes');
																}
						$(this).remove();
					});
				});
				
			};
			
			$('.box .box-slot').css('background-color', '#555');
			$('body').off('mousemove');
			$('body').off('mouseup');
		});
		
	});
	
	/*
	//drag and drop CRUDE MOBILE
	$('body').on('touchstart', '.draggable', function(downEvent) {
		console.log(downEvent.originalEvent.changedTouches[0].pageX);
		downEvent.preventDefault();
		var draggedElement = $(this); 
		var xOffset = draggedElement.offset().left - downEvent.originalEvent.changedTouches[0].pageX + draggedElement.width()/2;
		var yOffset = draggedElement.offset().top - downEvent.originalEvent.changedTouches[0].pageY + draggedElement.height()/2;

		draggedElement.css({
			position: 'absolute',
			width: draggedElement.width(),
			//change the left/top on start to begin 'in hand'
			left: downEvent.originalEvent.changedTouches[0].pageX - draggedElement.width()/2 + xOffset,
			top: downEvent.originalEvent.changedTouches[0].pageY - draggedElement.height()/2 + yOffset
		});

		draggedElement.appendTo('body');

		$('body').on('touchmove', (function(moveEvent) {
			draggedElement.css({
				left: moveEvent.originalEvent.changedTouches[0].pageX - draggedElement.width()/2 + xOffset,
				top: moveEvent.originalEvent.changedTouches[0].pageY - draggedElement.height()/2 + yOffset
			});
		}));

		$('body').on('touchend',function(){
			$('body').off('touchmove');
		});
	});
	*/
});