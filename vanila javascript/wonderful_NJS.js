/*
	Let's write some stupid vanilla JavaScript.

	Let me guys just make sure that my application does not deal with
	browser diffrences, OF COURCE. It's just a stupid application for
	only a single envirement (chrome). If it does not work for you, you
	can run it on the latest version of chrome, or even compile it, or
	just do nothing because it's exactlly the same application that
	I have built with jQuery.

	And for those images I'am using are Designed by "Freepik.com".

	Copyright(c) Adel Dfin
	You can find me on twitter: @trueJSLover
*/

const myOwnStupidHelperAPI = (function ( ww, dc, undefined ) {
	let interval = null;
	let currentTime = 0;

	const unitLessProps = [
		'opacity',
		'order',
		'zIndex',
		'lineHeight',
		'backgroundColor',
		'color',
		'transform',
		'transformOrigin'
	];

	const easing = {
		linear( t, b, c, d ) {
			return c * ( t / d ) + b;
		},
		easeInOutQuart( t, b, c, d ) {
			// this is a true copy and paste from jQuery_Easing, but trust me I truelly understand it
			if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t * t * t + b;
			return -c / 2 * ( ( t -= 2 ) * t * t * t - 2 ) + b;
		}
	};

	const tweens = [];

	const tween = {
		start: 0,
		end: 1,
		duration: 100,
		easing: 'linear',
		checkEnd( end ) {
			let rege = /([-+]=)?([-+]?\d+(?:\.\d+)?)([a-z]{2,3}|%)?/i,
				val = rege.exec( end );

			if ( val == null ) throw Error('Invalid end');

			this.unit = val[ 3 ] ? val[ 3 ] : ( unitLessProps.includes( this.prop ) ? '' : 'px');

			let value = rege.exec( this.elem.style[ this.prop ] ) ||
				rege.exec( ww.getComputedStyle( this.elem, null )[ this.prop ] );

			this.checkUnit( value );

			this.end = val[ 1 ] ? this.start + ( val[ 1 ].charAt( 0 ) + 1 ) * val[ 2 ]
				: ( val[ 2 ] ? val[ 2 ] : 0 );
		},
		checkUnit( val ) {
			if ( val && this.unit && this.unit != val[ 3 ] ) {
				myOwnStupidHelperAPI.style( this.elem, this.prop, val[ 2 ], this.unit );

				let scale = myOwnStupidHelperAPI.style( this.elem, this.prop, null, null, true ) / val[ 2 ];

				this.start = val[ 2 ] / scale;
				myOwnStupidHelperAPI.style( this.elem, this.prop, this.start, this.unit );
			} else {
				this.start = val ? Number( val[ 2 ] ) : 0;
			}
		},
		run() {
			let elapsedTime = Math.min( this.duration, currentTime - this.elem.startTime );

			let res = easing[ this.easing ] (
			   elapsedTime,
			   this.start,
			   this.end - this.start,
			   this.duration,
			   this.elem
			);

			myOwnStupidHelperAPI.style( this.elem, this.prop, res, this.unit );

			if ( this.step ) this.step.call( this.elem, res, this );

			return elapsedTime < this.duration;
		}
	}

	const animation = {
		setUpAnim( elem, props, duration, easing, fn ) {
			for ( let prop in props ) {
				let tweeny = Object.assign(
						Object.create( tween ),
						{
							elem,
							prop,
							start: myOwnStupidHelperAPI.style( elem, prop, null, null, true ),
							duration,
							easing,
							step: fn
						}
					);

				tweeny.checkEnd( props[ prop ] );
				tweens.push( tweeny );
			}

			let p = new Promise(( res, rej ) => {
				elem.resolve = res;
			});

			elem.startTime = new Date().getTime()
			this.startTimer();

			elem.promise = p;
		},
		timer() {
			currentTime = new Date().getTime();

			for ( let i = 0; i < tweens.length; i++ ) {
				let tweeny = tweens[ i ];

				if ( !tweeny.run() ) {
					tweeny.elem.resolve();
					tweens.splice( i--, 1 );
				}

				if ( !tweens.length ) this.shutDown();
			}

			currentTime = undefined;
		},
		startTimer() {
			if ( !interval ) interval = ww.setInterval( () => this.timer(), 16 );
		},
		shutDown() {
			clearInterval( interval );
			interval = null;
		}
	};

	return {
		style( elem, style, value, unit = 'px', isScaler ) {
			if ( elem == null || style == null ) return;

			if ( typeof style === 'object' || value != null ) {
				if ( value != null ) {
					elem.style[ style ] = value + ( unitLessProps.includes( style ) ? '' : unit );
				} else {
					for ( let key in style ) {
						elem.style[ key ] = style[ key ] + ( unitLessProps.includes( key ) ? '' : unit );
					}
				}
			} else {
				let v =  ww.getComputedStyle( elem, null )[ style ];
				return ( isScaler == true ? parseFloat( v ) : v );
			}
		},
		anim( elem, props, duration, easing ) {
			animation.setUpAnim( ...arguments );

			let promise = elem.promise;

			promise.done = function ( callback ) { promise.then( callback.bind( elem ) ); };
			promise.fail = function ( callback ) { null, promise.then( callback.bind( elem ) ); };

			return promise;
		},
		forEach( elems, callback ) {
			let dfds = [];

			if ( Array.isArray( elems ) ) {
				for ( let i = 0; i < elems.length; i++ ) {
					let elem = elems[ i ];

					callback.apply( elem, [ i, elem, elems ] );

					dfds.push( elem.promise );
				}
			} else {
				for ( let prop in elems ) {
					let elem = elems[ prop ];
					callback.apply( elem, [ prop, elem, elems ] );
					dfds.push( elem.promise() );
				}
			}

			return Promise.all( dfds );
		}
	};
})( window, document );

window.onload = () => {
	let rowNum = 3,
		columnNum = 3,
		menuSize = 50,
		margin = 10,
		easing = 'easeInOutQuart',
		d = 800,
		mainWidth,
		mainHeight,
		planeNum = 4;

	let images = [
	    'takepic_jr1bxc',
	    'picpic_dog9ft',
	    'musicpic_wjvnob',
	    'msgpic_hjsaob',
	    'ipodpic_skcnt0',
	    'homepic_xb2zwa',
	    'glassespic_bwjrxy',
	    'configpic_knqrcm',
	    'bookpic_fdnadh'
	]
	
	let colors = [ '#FFF', '#8EF0F7', '#FF87C6', '#FFF387' ];

	let main = document.getElementById('main'),
		menu = document.getElementById('menu'),
		menuWidth = myOwnStupidHelperAPI.style( menu, 'width', null, null, true ),
		menuHeight = myOwnStupidHelperAPI.style( menu, 'height', null, null, true );

	let planeDfds;
	let planeDfds2;
	let iconHeight;

	myOwnStupidHelperAPI.style( main, 'width', mainWidth = ( menuSize * columnNum + margin * ( columnNum - 1 ) ) );
	myOwnStupidHelperAPI.style( main, 'height', mainHeight = ( menuSize * rowNum + margin * ( rowNum - 1 ) ) );

	myOwnStupidHelperAPI.style( menu, 'left', ( mainWidth / 2 ) - menuWidth / 2 );
	myOwnStupidHelperAPI.style( menu, 'top', ( mainHeight / 2 ) - menuHeight / 2 );

	function setUpIcons() {
		for ( let i = 0; i < 3; i++ ) {
			let el = document.createElement('DIV');

			el.setAttribute('id', 'icon');

			myOwnStupidHelperAPI.style( el, 'height', iconHeight = ( (menuSize / 3) - (6 + 6 / 3) ) );
			myOwnStupidHelperAPI.style( el, 'top', (iconHeight + 6) * i + 6 );

			document.getElementById('menu').appendChild( el );
		}
	}

	const each_with_delay = function ( array, interval, callback ) {
		let i = 0;
		let dfds = [];

		if ( !array.length ) return;

		next();

		function next() {
			if ( callback.call( array[ i ], i, array[ i ] ) != false ) {
				dfds.push( array[ i ].promise );

				if ( ++i < array.length ) {
					window.setTimeout( next, interval );
				}
			}
		}

		return Promise.all( dfds );
	};

	const close = function () {
		let items = main.querySelectorAll('#newMenu');
		let center = items[ 4 ];
		let center_left = myOwnStupidHelperAPI.style( center, 'left', null, null, true );
		let center_top = myOwnStupidHelperAPI.style( center, 'top', null, null, true );
		let elems = Array.prototype.slice.call( items );

		myOwnStupidHelperAPI.forEach(elems, function ( idx, elem ) {
			let left;
			let top;

			if ( myOwnStupidHelperAPI.style( elem, 'left', null, null, true ) > center_left )
				left = -( margin / mainWidth ) * 100;
			else if ( myOwnStupidHelperAPI.style( elem, 'left', null, null, true ) < center_left )
				left = ( margin / mainWidth ) * 100;
			if ( myOwnStupidHelperAPI.style( elem, 'top', null, null, true ) > center_top )
				top = -( margin / mainWidth ) * 100;
			else if ( myOwnStupidHelperAPI.style( elem, 'top', null, null, true ) < center_top )
				top = ( margin / mainWidth ) * 100;

			if ( elem != center ) {
				myOwnStupidHelperAPI.anim(
					elem,
					{
						left: '+=' + ( left || 0 ) + '%',
						top: '+=' + ( top || 0 ) + '%'
					},
					500,
					'linear'
				);
			}
			
		}).then(() => {
			let num = 7;
			let newContainer = document.createElement('DIV');
			let width = menuSize * columnNum;
			let height = menuSize * rowNum;
			let elems = main.querySelectorAll('#newMenu');
			let dfds = [];

			newContainer.setAttribute('id', 'newContainer');
			myOwnStupidHelperAPI.style( newContainer, 'position', 'absolute' );
			main.appendChild( newContainer );

			while ( num-- ) {
				let elem = document.createElement('DIV');

				myOwnStupidHelperAPI.style(
					elem,
					{
						width,
						height: ( height / 7 ) + 1,
						top: margin,
						marginTop: num == 6 ? 'none' : -1 
					}
				);

				elem.setAttribute('id', 'new');
				newContainer.appendChild( elem );
			}

			for ( let i = 0; i < elems.length; i++ ) {
				let elem = elems[ i ];
				elem.remove();
			}


			let menu = document.createElement('DIV');

			menu.setAttribute('id', 'menu');
			myOwnStupidHelperAPI.style( menu, 'left', ( mainWidth / 2 ) - menuWidth / 2 );
			myOwnStupidHelperAPI.style( menu, 'top', ( mainHeight / 2 ) - menuHeight / 2 );

			main.appendChild( menu );

			setUpIcons();

			menu.addEventListener('click', start, 'false');

			each_with_delay(
				newContainer.querySelectorAll('#new'),
				50,
				( idx, item ) => {
					function moveIt( res ) {
						myOwnStupidHelperAPI.anim(
							item,
							{
								width: 0
							},
							1000,
							easing
						).done(() => { res(); });
					}

					let p = new Promise(( res, rej ) => {
						moveIt( res, rej );
					});

					dfds.push( p );
				}
			).then(() => {
				Promise.all( dfds ).then(() => {
					newContainer.remove();
				});
			});

			myOwnStupidHelperAPI.anim(
				newContainer,
				{
					rotate: 45
				},
				1000,
				easing,
				( now, opts ) => {
					myOwnStupidHelperAPI.style(
						newContainer,
						'transform',
						'translate( -50%, -50% ) rotate(' + now + 'deg)'
					);
				}
			);
		});

	};

	const animPlane = function ( v, flipped ) {
		let length = 0;
		let elems = [];
		let fns = [];
		let rege = /-?\d/i;
		let arr = Array.prototype.slice.call( main.querySelectorAll('#newMenu') );

		arr.forEach(( child ) => {
			length = Math.max( Math.floor( child.children.length / 2 ), length );
		});	

		for ( let i = 0; i < length; i++ ) {
			elems[ i ] = [];
			for ( let j = 0; j < main.querySelectorAll('#newMenu').length; j++ ) {
				elems[ i ].push( main.querySelectorAll('#newMenu')[ j ].querySelectorAll('div')[ i * 2 ] );
				elems[ i ].push( main.querySelectorAll('#newMenu')[ j ].querySelectorAll('div')[ i * 2 + 1 ] );
			}

			fns[ i ] = function () {
				planeDfds = [];
				return myOwnStupidHelperAPI.forEach(elems[ i ], ( idx, elem ) => {
					let rotation = 45;
					let angle = rotation * Math.PI / 180;
					let subcalss = Number( elem.className.match( rege )[ 0 ] );
					let sin = Math.sin( angle ) * v;
					let cos = Math.cos( angle ) * v;
					let index = Math.abs( subcalss );
					let fn = function ( resolve, reject ) {
						myOwnStupidHelperAPI.anim(
							elem,
							{
								marginLeft: '+=' + ( idx % 2 == 0 ? -cos : cos ),
								marginTop: '+=' + ( idx % 2 == 0 ? -sin : sin ),
							},
							d,
							easing
						).done(() => {
							resolve();
						});
					}

					if ( flipped == true ) {
						myOwnStupidHelperAPI.style(
							elem,
							{
								backgroundColor: colors[ colors.length - index ],
								zIndex: index
							}
						);
					}

					let p = new Promise( ( res, rej ) => fn( res, rej ) );

					planeDfds.push( p );
				});
			};
		}
		
		return fns;
	};

	const animPlaneC = function ( target, flipped ) {
		let fns = animPlane( ...arguments );

		planeDfds2 = [];

		fns.forEach(( fn, idx ) => {
			let p = new Promise(( res, rej ) => {
				window.setTimeout(() => {
					fn().then(() => {
						Promise.all( planeDfds ).then(() => res());
					});
				}, 80 * idx);
			});

			planeDfds2.push( p );
		});
	};

	const open = function open( e ) {
		menu.removeEventListener( e.type, open, 'false');

		let elems = document.querySelectorAll('#icon').length;
		let len = elems.length;
		let dfds = [];

		while ( len-- ) {
			let icon = elems[ len ];
			icon.remove();
		}

		len = 2;
		elems = [];

		while ( len-- ) {
			let elem = menu.cloneNode();
			main.appendChild( elem );
			elems.push( elem );
		}

		myOwnStupidHelperAPI.forEach( elems, function ( idx, elem ) {
			let stupidChain = function ( res ) {
				let percent = ( ( menuSize + margin ) / mainWidth ) * 100;

				myOwnStupidHelperAPI.anim(
					elem,
					{
						left: '+=' + ( idx == 0 ? -percent : percent ) + '%'
					},
					d,
					easing 
				).done(function () {
					let elem = this.cloneNode();
					main.appendChild( elem );
					myOwnStupidHelperAPI.anim(
						elem,
						{
							top: '+=' + ( idx == 0 ? -percent : percent ) + '%'
						},
						d,
						easing
					).done(function () {
						let elem = this.cloneNode();
						main.appendChild( elem );
						myOwnStupidHelperAPI.anim(
							elem,
							{
								left: '+=' + ( idx == 0 ? percent : -percent ) + '%'
							},
							d,
							easing
						).done(function () {
							let elem = elems[ idx ].cloneNode();
							main.appendChild( elem );
							myOwnStupidHelperAPI.anim(
								elem,
								{
									top: '+=' + ( idx == 0 ? percent : -percent ) + '%'
								},
								d,
								easing
							).done( () => res() );
						});
					});
				});
			};

			let p = new Promise(( res, rej ) => {
				stupidChain( res );
			});

			dfds.push( p );

		}).then(() => {
			Promise.all( dfds ).then(function () {
				let items = main.querySelectorAll('#menu');

				for ( let y = 0; y < rowNum; y++ ) {
					for ( let x = 0; x < columnNum; x++ ) {
						let elem = document.createElement('DIV');
						let image = document.createElement('IMG');

						elem.setAttribute('id', 'newMenu');
						image.setAttribute('class', 'image');
						image.setAttribute('src', 'http://res.cloudinary.com/dd0hzltor/image/upload/v1458152687/' + images[ x + y * columnNum ] + '.png');

						myOwnStupidHelperAPI.style(
							elem,
							{
								left: ( ( ( menuSize + margin ) * x ) / mainWidth ) * 100,
								top: ( ( ( menuSize + margin ) * y ) / mainWidth ) * 100
							},
							null,
							'%'
						);

						myOwnStupidHelperAPI.style(
							image,
							{
								width: menuSize,
								height: menuSize
							}
						);

						for ( let i = 0; i < planeNum; i++ ) {
							let inner1 = document.createElement('DIV');
							let inner2 = document.createElement('DIV');

							inner1.setAttribute('class', 'inner e' + ( i + 1 ));
							inner2.setAttribute('class', 'inner e' + -( i + 1 ));

							myOwnStupidHelperAPI.style(
								inner1,
								{
									backgroundColor: colors[ i ],
									width: ( mainWidth / 2 ) + 100,
									height: mainHeight + 100 * 2,
									marginLeft: -( menuSize + margin ) * x - 100,
									marginTop: -( menuSize + margin ) * y - 100,
									transformOrigin: 'right center',
									zIndex: planeNum - i
								}
							);

							myOwnStupidHelperAPI.style(
								inner2,
								{
									backgroundColor: colors[ i ],
									width: ( mainWidth / 2 ) + 100,
									height: mainHeight + 100 * 2,
									marginLeft: -( menuSize + margin ) * x + ( mainWidth / 2 ),
									marginTop: -( menuSize + margin ) * y - 100,
									transformOrigin: 'left center',
									zIndex: planeNum - i
								}
							);

							elem.appendChild( inner1 );
							elem.appendChild( inner2 );
						}

						elem.appendChild( image );
						main.appendChild( elem );
					}
				}

				for ( let i = 0; i < items.length; i++ ) {
					let item = items[ i ];
					item.remove();
				}

				animPlaneC( 120, false );

				Promise.all( planeDfds2 ).then(() => {
					let elem = document.createElement('DIV');

					elem.setAttribute('id', 'close');
					elem.appendChild( document.createTextNode('Close') );

					myOwnStupidHelperAPI.style( elem, 'width', mainWidth );

					main.appendChild( elem );

					myOwnStupidHelperAPI.anim(
						elem,
						{
							top: 104 + '%',
							opacity: 1
						},
						200,
						'linear'
					).done(() => {
						function cb() {
							elem.removeEventListener('click', cb, 'false');
							myOwnStupidHelperAPI.anim(
								elem,
								{
									top: 95 + '%',
									opacity: 0
								},
								200,
								'linear'
							).done(() => {
								elem.remove();

								animPlaneC( -120, true );
								Promise.all( planeDfds2 ).then(() => {
									close();
								});
							});
						}

						elem.addEventListener('click', cb, 'false')
					});
				});
			});
		});
	};

	function start( e ) {
		var icons = document.querySelectorAll('#icon');

		myOwnStupidHelperAPI.forEach( [].slice.call( icons ), ( idx, icon ) => {

			myOwnStupidHelperAPI.anim(icon,
				{
					height: 0,
					top: '+=' + ( iconHeight / 2 )
				},
				200,
				easing
			);

		}).then(() => {
			open.call( this, e );
		});
	}

	setUpIcons();
	menu.addEventListener('click', start, 'false');
};
