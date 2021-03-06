/*!
 * jQuery SimpleSlider
 * 
 * @autor......: Juarez Gonçalves Nery Junior
 * @email......: juareznjunior@gmail.com
 * @twitter....: @juareznjunior
 * @git........: https://github.com/juareznjunior/jQuery-SimpleSlider
 */
/*!
 * jQuery SimpleSlider
 * 
 * @autor......: Juarez Gonçalves Nery Junior
 * @email......: juareznjunior@gmail.com
 * @twitter....: @juareznjunior
 * @git........: https://github.com/juareznjunior/jQuery-SimpleSlider
 */
;(function($,window,document,undefined) {

	var SimpleSlider = function($container, options) {

		// vars jQuery Object
		// private
		var $slides
			,$enabled
			,$nav
			,$nextSlide
			,$prevSlide;

		// var
		// private
		var leftPosition
			,timer
			,delay
			,transition;

		// private
		// return html markup buttons
		var htmlNavButtons = function() {
			return '<button class="slides-nav" name="prev">Prev</button><button class="slides-nav" name="next">Next</button>';
		}

		// private
		// timeout next slide
		var triggerTimeOut = function() {
			timer = window.setTimeout(function(){
				$nav.last().trigger('click');
			},delay)
		}

		// options defaults
		this.options = $.extend({},{
			width: 620
			,height: 200
			,nav:  true
			,delay: 8000
			,transition: 'slide'
		},options);

		// set timeout
		delay = this.options.delay;

		// transition
		transition = {
			slide: function(l) {
				return { anim: {left:l},mprior: {left:0,zIndex:1} }
			}
			,fade: function(o) {
				return { anim: {opacity:0},mprior: {zIndex:1,opacity:1} }				
			}
		}

		transition = transition[ (this.options.transition === 'slide')  ? 'slide' : 'fade'];
		
		// container dimensions and className
		$container.css({
			width: this.options.width
			,height: this.options.height
		}).addClass('slides-container');;

		// set $nav
		$nav = $(htmlNavButtons()).appendTo($container[0]);

		// hide if options.nav is false
		if ( false === this.options.nav ) {
			$nav.hide();
		}

		// slides cache
		$slides = $container.find('.slide').removeClass('enabled');

		// slide enabled
		$enabled = $slides.first().addClass('enabled');

		// $container width
		leftPosition = $container.width();

		// delegate
		$container.on('click','button.slides-nav',function(e) {

			e.preventDefault();
			$nav.prop('disabled',true);

			// if animated
			$enabled.stop();

			// stop timeout
			window.clearTimeout(timer);

			// caches
			$nextSlide = $enabled.next();
			$prevSlide = $enabled.prev();

			// enable next or prev
			if ( 'next' === this.name ) {
				$nextSlide = ( $nextSlide.length )
					? $nextSlide
					: $slides.first();

				e = '+='+leftPosition;
				
			} else {
				$nextSlide = ( $prevSlide.length )
					? $prevSlide
					: $slides.last();

				e = '-='+leftPosition;
			}

			// priority z-index next slide
			$nextSlide.css('zIndex',9);

			e = transition.call(this,e);

			// left animate
			$enabled.animate(e.anim,500,function(){

				// minor priority
				$enabled.removeClass('enabled').css(e.mprior);

				// set new $enabled slide
				// priority z-index enabled slide
				$enabled = $nextSlide.css('zIndex',10);

				// clear caches
				$nextSlide = $prevSlide = null;

				// enable nav buttons
				$nav.prop('disabled',false);

				// set timeout
				triggerTimeOut();
			});
		});

		// set timeout primary
		triggerTimeOut();
	};

	// jQuery Plugin expose
	$.fn.simpleSlider = function(options) {
		return this.each(function(data){
			data = $.data(this,'SimpleSlider');
			if ( undefined === data ) {
				$.data(this,'SimpleSlider',new SimpleSlider($(this),options));
			}
		});
	}
}(jQuery,window,document));