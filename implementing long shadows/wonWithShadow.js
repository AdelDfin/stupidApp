/*
	This is a simple application has built using jQuery.js.
	In addition, I've implemented a stupid trick to simulate
	long shadows feature.

	If you want to see the same application without this kind
	of trick, check the link below.

	#link

	But if you're more interested in native JS and want to
	see the whole same application built from scratch
	without using any libraries or frameworks, check it
	out in the link below.
	(Please note that the native version is not supporting
	long shadows).

	#link.

	Copyright(c) Adel Dfin.
	You can find me on twitter: @trueJSLover
*/

$( document ).ready(() => {
	'use strict';

	let menuSize = 50,
		margin = 10,
		columnNum = 3,
		rowNum = 3,
		planeNum = 4,
		easing = 'easeInOutQuart',
		d = 800,
		imgs = [
		    'takepic_jr1bxc',
		    'picpic_dog9ft',
		    'musicpic_wjvnob',
		    'msgpic_hjsaob',
		    'ipodpic_skcnt0',
		    'homepic_xb2zwa',
		    'glassespic_bwjrxy',
		    'configpic_knqrcm',
		    'bookpic_fdnadh'
		],
		colors = [ '#FFF', '#8EF0F7', '#FF87C6', '#FFF387' ],
		mainWidth,
		mainHeight,
		iconHeight,
		PlaneDfds = [],
		PlaneDfds2 = [];

    jQuery.slowEach = function( array, interval, callback ) {
        var i = 0;

        if( !array.length ) return;
        
        next();
        
		function next() {
		    if( callback.call( array[i], i, array[i] ) != false ) {
		    	if( ++i < array.length ) {
		            setTimeout( next, interval );
		        }
		    }
		}
        
        return array;
    };

    var init = () => {
		$('#wrapper').css({
			left: ( mainWidth / 2 ) - ( parseFloat( $('#menu').css('width') ) / 2 ),
			top: ( mainHeight / 2 ) - ( parseFloat( $('#menu').css('width') ) / 2 )
		});
	};

	function setUpIcons() {
		for ( let i = 0; i < 3; i++ ) {
			let el = $("<div id = 'icon' ></div>");

			el.css('height', iconHeight = ( (menuSize / 3) - (6 + 6 / 3) ));
			el.css('top', (iconHeight + 6) * i + 6);

			$('#menu').append( el );
		}
	}

	var close = function () {
		let center = $('#main').children()[ 4 ],
			center_left = $.css( center, 'left', '' ),
			center_top = $.css( center, 'top', '' );

		$('#main').children().each(function ( idx, elm ) {
			let left, top;

			if ( $.css( elm, 'left', '' ) > center_left )
				left = -( ( margin / mainWidth ) * 100 );
			else if (  $.css( elm, 'left', '' ) < center_left )
				left = ( margin / mainWidth ) * 100;

			if ( $.css( elm, 'top', '' ) > center_top )
				top = -( ( margin / mainHeight ) * 100 );
			else if (  $.css( elm, 'top', '' ) < center_top )
				top = ( margin / mainHeight ) * 100;

			if ( elm != center ) {
				$( elm ).animate({
					top: '+=' + top + '%',
					left: '+=' + left + '%'
				}, {
					duration: 500,
					easing: 'linear'
				});
			}
		}).promise().done(function () {
			let l = 7,
				newContainer = $("<div id = 'newContainer' >"),
				height = ( menuSize * rowNum ),
				width = menuSize * columnNum,
				elems = $('#main').children(),
				dfds = [];

			$('#main').append( newContainer );

			while ( l-- ) {
				let wrapper = $("<div id = 'wrap' ></div>");
				let elm = $("<div id = 'new' ></div>");
				let shadow = $("<div id = 'mainShadow' ></div>");
				let x = $("<div id = 'X' ></div>");
				let y = $("<div id = 'Y' ></div>");

				shadow.css({
					width,
					height: ( height / 7 ) + 1
				});

				x.css('left', width);
				x.css('top', 0);

				y.css('left', 0);
				y.css('top', ( height / 7 ) + 1);

				wrapper.css({
					width: width,
					height: ( height / 7 ) + 1,
					top: margin,
					marginTop: l == 6 ? 'none' : -1,
					overflow: 'visible'
				});

				$( shadow ).append( x );
				$( shadow ).append( y );
				$( wrapper ).append( elm );
				$( wrapper ).append( shadow );
				$('#newContainer').append( wrapper );
			};

			elems.remove();
			$('#main').append("<div id = 'wrapper' >");

			$('#wrapper').append("<div id = 'menu' >");
			$('#wrapper').append("<div id = 'shadow' >");

			$('#shadow').append("<div id = 'X' >");
			$('#shadow').append("<div id = 'Y' >");

			$('#shadow #X').css({
				top: 0,
				left: menuSize,
				opacity: 0
			});

			$('#shadow #Y').css({
				left: 0,
				top: menuSize,
				opacity: 0
			});

			for ( let i = 0; i < 3; i++ ) {
				let el = $("<div id = 'icon' ></div>");
				$('#menu').append( el );
			}

			setUpIcons();
			init();

			$('#menu').one( 'click', start );

			$.slowEach(
				$('#newContainer').children(),
				50,
				function ( idx, item ) {
					let dfd = $.Deferred();

					$( item ).animate({
						width: 0
					}, {
						queue: false,
						duration: 1000,
						easing: 'easeInOutQuart',
						step( now, opts ) {
							// I don't really know who generate this kind of style(hiding the overflow):
							$( item ).css('overflow', 'visible');
							$( item ).find('#mainShadow #X').css('left', now);
							$( item ).find('#mainShadow #Y').css('width', now);
						}
					}).promise().done(() => { dfd.resolve(); });

					dfds.push( dfd );
				}
			).promise().done(() => {
				$.when( ...dfds ).then(() => {
					$('#newContainer').remove();
				});
			});

			$('#newContainer').animate({
				rotate: 45
			}, {
				queue: false,
				duration: 1000,
				easing: 'easeInOutQuart',
				step( now ) {
					$( this ).css('transform', 'translate( -50%, -50% ) rotate(' + now + 'deg)');
					$('#mainShadow #X').css('transform', 'skewY(' + ( 45 - now ) + 'deg)');
					$('#mainShadow #Y').css('transform', 'skewX(' + ( 45 + now ) + 'deg)');

					$('#mainShadow #X').css('opacity', ( 45 - now ) / 30);
					$('#mainShadow #Y').css('opacity', ( 45 - now ) / 30);
				}
			}).promise().done(() => {
				$('#shadow #X, #shadow #Y').animate({
					opacity: 1
				},{
					duration: 1000
				});
			});
		});
	};

	var animPlane = function ( val, flip ) {
		let length = 0,
			elems = [],
			functions = [];

		$('div#wrapper').each(function ( idx, child ) {
			length = Math.max( $( child ).find('#newMenu').children('div:even').length, length );
		});

		for ( let i = 0; i < length; i++ ) {
			elems[ i ] = [];
			for ( let j = 0; j < $('div#wrapper').length; j++ ) {
				elems[ i ].push( $('div#wrapper:eq(' + j + ')').find('#newMenu').children('div:eq(' + ( i * 2 ) + ')') );
				elems[ i ].push( $('div#wrapper:eq(' + j + ')').find('#newMenu').children('div:eq(' + ( ( i * 2 ) + 1 ) + ')') );
			}
			functions[ i ] = function () {
				PlaneDfds = [];
				return $( elems[ i ] ).each(function ( idx, elem ) {
					let rotation = 45,
					value = val,
					angle = rotation * Math.PI / 180,
					subclass = Number( elem[ 0 ].className.match( /-?\d{1}/g )[ 0 ] ),
					sin = Math.sin( angle ) * value,
					cos = Math.cos( angle ) * value,
					i = Math.abs( subclass ),
					dfd = $.Deferred();

					if ( flip == true ) {
						elem.css({
							zIndex: i,
							backgroundColor: colors[ colors.length - i ]
						});
					}

					elem.animate({
						marginLeft: '+=' + ( idx % 2 == 0 ? -cos : cos ),
						marginTop: '+=' + ( idx % 2 == 0 ? -sin : sin ),
						shadow: 11				
					}, {
						duration: 1000,
						easing: easing
					}).promise().done(() => { dfd.resolve(); });

					PlaneDfds.push( dfd );
				});
			}
		}

		return functions;
	};

	var animPlaneC = function ( target, flip ) {
		let fns = animPlane( target, flip );

		PlaneDfds2 = [];

		fns.forEach(function ( fn, idx ) {
			let dfd2 = $.Deferred();
			setTimeout(() => {
				fn().promise().done(() => {
					$.when( ...PlaneDfds ).then(() => {
						dfd2.resolve();
					});
				});
			}, 80 * idx);
			PlaneDfds2.push( dfd2 );
		});
	}

	var open = function () {
		let i = 2,
			dfds = [],
			elems = [],
			elm;

		$('#menu').empty();

		while ( i-- ) {
			elm = $( this ).clone();
			$('#main').append( elm );
			elems.push( elm );
		}

		$( elems ).each(function ( index, elem ) {
			let percent = ( ( menuSize + margin ) / mainWidth ) * 100, dfd = $.Deferred();

			dfds.push( dfd );

			elem.animate({
				left: '+=' + ( index == 0 ? -percent : percent ) + '%'
			}, {
				duration: d,
				easing: easing
			}).promise().done(function () {
				let percent = ( ( menuSize + margin ) / mainHeight ) * 100,
					elm = $( this ).clone();

				$('#main').append( elm );
				elm.animate({
					top: '+=' + ( index == 0 ? percent : -percent ) + '%'
				}, {
					duration: d,
					easing: easing
				}).promise().done(function () {
					let percent = ( ( menuSize + margin ) / mainWidth ) * 100,
						elm = $( this ).clone();

					$('#main').append( elm );
					elm.animate({
						left: '+=' + ( index == 0 ? percent : -percent ) + '%' 
					}, {
						duration: d,
						easing: easing
					}).promise().done(function () {
						let percent = ( ( menuSize + margin ) / mainHeight ) * 100,
							elm = elems[ index ].clone();

						$('#main').append( elm );

						elm.animate({
							top: '+=' + ( index == 0 ? -percent : percent ) + '%' 
						}, {
							duration: d,
							easing: easing
						}).promise().done(function () { dfd.resolve(); });
					});
				});
			});
		}).promise().done(function () {
			$.when( ...dfds ).then(function () {
				var menu = $('#main').children();

				for ( let i = 0; i < rowNum; i++ ) {
					for ( let j = 0; j < columnNum; j++ ) {
						let wrapper = $("<div id = 'wrapper' ></div>"),
							newMenu = $("<div id = 'newMenu' ></div>"),
							shadow = $("<div id = 'shadow' ></div>"),
							image = $("<img class = 'image' src = 'http://res.cloudinary.com/dd0hzltor/image/upload/v1458152687/" + imgs[ j + i * columnNum ] + ".png'>"),
							x = $("<div id = 'X' ></div>"),
							y = $("<div id = 'Y' ></div>");

						wrapper.css({
							left: ( menuSize + margin ) * j,
							top: ( menuSize  + margin ) * i,
						});

						for ( let l = 0; l < planeNum; l++ ) {
							let inner1 = $("<div class = 'inner e" + ( l + 1 ) + "' >"),
								inner2 = $("<div class = 'inner e" + -( l + 1 ) + "' >");

							inner1.css({
								backgroundColor: colors[ l ],
								width: ( mainWidth / 2 ) + 100,
								height: mainHeight + (100 * 2),
								marginLeft: -( menuSize + margin ) * j - 100,
								marginTop: -( menuSize + margin ) * i - 100,
								transformOrigin: ((mainWidth / 2) + 100) + 'px ' + ((mainHeight / 2) +  100) + 'px',
								zIndex: ( planeNum - l )
							});

							inner2.css({
								backgroundColor: colors[ l ],
								width: ( mainWidth / 2 ) + 100,
								height: mainHeight + (100 * 2),
								marginLeft: -( menuSize + margin ) * j + ( mainWidth / 2 ),
								marginTop: -( menuSize + margin ) * i - 100,
								transformOrigin: '0px ' + ((mainHeight / 2) + 100) + 'px',
								zIndex: ( planeNum - l )
							});

							image.css({
								width: menuSize,
								height: menuSize
							});

							$( newMenu ).append( inner1 );
							$( newMenu ).append( inner2 );
						}

						x.css('left', menuSize);
						x.css('top', 0);

						y.css('left', 0);
						y.css('top', menuSize);

						shadow.append( x );
						shadow.append( y );

						$( newMenu ).append( image );

						wrapper.append( newMenu );
						wrapper.append( shadow );
						$('#main').append( wrapper );
					}
				}

				menu.remove();

				animPlaneC( 120, false );

				$.when( ...PlaneDfds2 ).then(() => {
					let elm = $("<div id = 'close' >Close</div>");

					elm.css('width', mainWidth);

					$('#main').append( elm );

					elm.animate({
						top: 104 + '%',
						opacity: 1
					}, { duration: 200, easing: 'easeOutBack' }).promise().done(() => {
						$('#close').one('click', () => {
							elm.animate({
								top: 95 + '%',
								opacity: 0
							}, { duration: 200, easing: 'easeInBack' }).promise().done(() => {
								elm.remove();

								animPlaneC( -120, true );
								$.when( ...PlaneDfds2 ).then(() => {
									close();
								});
							});
						});
					});
				});

			});
		});
	}

	function start() {
		$('div#icon').each(( idx, icon ) => {
			$( icon ).animate({
				height: 0,
				top: '+=' + ( iconHeight / 2 )
			}, { duration: 200, easing: 'linear'});
		}).promise().done(() => {
			open.call( $( this ).parent() );
		});
	}

	$('#main').css({
		width: ( mainWidth = ( menuSize * columnNum ) + ( margin * ( columnNum - 1 ) ) ),
		height: ( mainHeight = ( menuSize * rowNum ) + ( margin * ( rowNum - 1 ) ) )
	});

	init();
	setUpIcons();

	$('#menu').one('click', start);
});
