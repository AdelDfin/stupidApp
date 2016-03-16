/*
	This is a simple application has built using jQuery.js

	There is actually another vesion of the same application
	but adding an additional feature to it, which is known
	as: 'Long shadows'. This feature is not supported by CSS,
	but I've tried to hack it.

	Check it out here: #link

	But if you're more interested in native JS and want to
	see the whole same application built from scratch
	without using any libraries or frameworks, check it
	out on Github in the link bellow.

	#link.

	Copyright(c) Adel Dfin.
	You can find me on twitter: @trueJSLover
*/

$( document ).ready(() => {
	let menuSize = 50,
		margin = 10,
		columnNum = 3,
		rowNum = 3,
		planeNum = 4,
		easing = 'easeInOutQuart',
		d = 800,
		imgs = [
		    'takepic_jr1bxc.png',
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
		extansion = 'png',
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

	$('#main').css({
		width: ( mainWidth = ( menuSize * columnNum ) + ( margin * ( columnNum - 1 ) ) ),
		height: ( mainHeight = ( menuSize * rowNum ) + ( margin * ( rowNum - 1 ) ) )
	});

	function setUpIcons() {
		for ( let i = 0; i < 3; i++ ) {
			let el = $("<div id = 'icon' ></div>");

			el.css('height', iconHeight = ( (menuSize / 3) - (6 + 6 / 3) ));
			el.css('top', (iconHeight + 6) * i + 6);

			$('#menu').append( el );
		}
	}

	setUpIcons();

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
				let elm = $("<div id = 'new' ></div>");

				elm.css({
					width: width,
					height: ( height / 7 ) + 1,
					top: margin,
					marginTop: l == 6 ? 'none' : -1
				});

				$('#newContainer').append( elm );
			};

			elems.remove();
			$('#main').append("<div id = 'menu' >");

			setUpIcons();

			$('#menu').one( 'click', start );

			$.slowEach(
				$('#newContainer').children(),
				50,
				function ( idx, item ) {
					let dfd = $.Deferred();

					$( this ).animate({
						width: 0
					}, {
						queue: false,
						duration: 1000,
						easing: 'easeInOutQuart'
					}).promise().done(() => { dfd.resolve(); });

					dfds.push( dfd );
				}
			).promise().done(() => {
				$.when( ...dfds ).then(() => {
					$('#newContainer').remove();
				})
			});

			$('#newContainer').animate({
				rotate: 45
			}, {
				queue: false,
				duration: 1000,
				easing: 'easeInOutQuart',
				step( now ) {
					$( this ).css('transform', 'translate( -50%, -50% ) rotate(' + now + 'deg)');
				}
			});

		});
	};

	var animPlane = function ( val, flip ) {
		let length = 0,
			elems = [],
			functions = [];

		$('#main').children('#newMenu').each(function ( idx, child ) {
			length = Math.max( $( child ).children('div:even').length, length );
		});

		for ( let i = 0; i < length; i++ ) {
			elems[ i ] = [];
			for ( let j = 0; j < $('#main').children('#newMenu').length; j++ ) {
				elems[ i ].push( $('#main').children('div:eq(' + j + ')').children('div:eq(' + ( i * 2 ) + ')') );
				elems[ i ].push( $('#main').children('div:eq(' + j + ')').children('div:eq(' + ( ( i * 2 ) + 1 ) + ')') );
			}
			functions[ i ] = function () {
				PlaneDfds = [];
				return $( elems[ i ] ).each(function ( idx, elem ) {
					let rotation = 45,
					value = val,
					angle = rotation * Math.PI / 180,
					subclass = Number( elem[ 0 ].className.match( /-?\d/g )[ 0 ] ),
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
						let elem = $("<div id = 'newMenu'></div>"),
							image = $("<img class = 'image' src = 'http://res.cloudinary.com/dd0hzltor/image/upload/v1458152687/" + imgs[ j + i * columnNum ] + ".png'>");

						elem.css({
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

							$( elem ).append( inner1 );
							$( elem ).append( inner2 );
						}

						$( elem ).append( image );
						$('#main').append( elem );
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
		}).promise().done(() => { open.call( this ); });
	}

	$('#menu').one('click', start);
});
