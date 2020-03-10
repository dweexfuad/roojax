// pShadow 1.o
// A jQuery extension to add gorgeous drop shadows to HTML elements
// By Matthew Dawkins
// www.matthewdawkins.co.uk

(function($) {
	$.fn.pShadow=function(options) {
		// Default settings
		var settings={
			'type':'corners',
			'depth':20,
			'strength':1
		};
		// Enable chaining
		return this.each(function() {
			// $this is now the current object
			var $this=$(this);
			// Override defaults
			if (options) $.extend(settings,options);
			// Set type of shadow
			var shadow;
			if (settings['type']=='corners') shadow='shadow1.png';
			else if (settings['type']=='middle') shadow='shadow2.png';
			// Repeat to overlay images to create strength
			$this.not('.pshadow').each(function() {
				var ownerelement = $(this);
				var ownerpos = $(this).offset();
				for (i=0;i<settings['strength'];i++) {
					// For self-closing elements
					if(/^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i.test($(this)[0].tagName)) {
						// Add owner class and image element
						$(this).addClass('haspshadow').after('<img src="'+shadow+'" alt="" class="pshadow" />');
						// Add styling for image
						$(this).next('.pshadow').each(function() {
							$(this).css('position','absolute')
							.css('left',ownerpos.left+'px')
							.css('width',ownerelement.outerWidth()+'px')
							.css('height',settings['depth']+'px')
							.css('top',(ownerpos.top+ownerelement.outerHeight())+'px')
							if (ownerelement.css('position')=='static') ownerelement.css('position','relative');
						});
					}
					// For non-self-closing elements
					else {
						// Add owner class and image element
						$(this).addClass('haspshadow').append('<img src="'+shadow+'" alt="" class="pshadow" />');
						// Add styling for image
						$(this).find('.pshadow:last').each(function() {
							$(this).css('position','absolute')
							.css('left','0')
							.css('width',$(this).parent().outerWidth()+'px')
							.css('height',settings['depth']+'px')
							.css('bottom','-'+settings['depth']+'px')
							if ($(this).parent().css('position')=='static') $(this).parent().css('position','relative');
						});
					}
				}
			});
			// Reset shadow images to override any conflicting CSS
			$('.pshadow').css('border','0')
			.css('padding','0')
			.css('background','none');
		});
	}
})(jQuery);