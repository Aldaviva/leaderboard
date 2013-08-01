(function(){

	var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	
	var currentPeriod = 'month';
	render();

	setInterval(togglePeriod, 15*1000);
	$('.periods div').click(togglePeriod);

	function togglePeriod(){
		currentPeriod = (currentPeriod == 'month') ? 'quarter' : 'month';
		render();
	}

	function render(){
		var now = new Date();
		$('.periods .quarter').text('Q' + Math.ceil((now.getMonth() + 1)/3));
		$('.periods .month').text(MONTH_NAMES[now.getMonth()]);

		$('.periods div').removeClass('active');
		$('.periods .'+currentPeriod).addClass('active');

		$('.rows .row').addClass('hidden');
		$('.rows .row.'+currentPeriod).removeClass('hidden');
	}

	var socketUrl = window.location.protocol+'//'+window.location.host;
	// console.log("connecting to socket "+socketUrl);
	var socket = io.connect(socketUrl);

	socket.on('connect', function(){
		// console.info('socket connected');
	});

	socket.on('change:leaders', function(){
		// console.log('socket received change:leaders event');
		window.location.reload();
	});

})();