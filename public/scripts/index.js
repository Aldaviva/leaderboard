(function(){

	var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var CATEGORIES = ['quarter', 'month', 'rep', 'sdr'];
	
	var currentCategory;
	setCategory(CATEGORIES[0]);
	render();

	setInterval(cycleCategory, 15*1000);
	CATEGORIES.forEach(function(categoryName){
		$('.categories .'+categoryName).click(function(){ setCategory(categoryName); });
	});

	function cycleCategory(){
		setCategory(CATEGORIES[(CATEGORIES.indexOf(currentCategory) + 1) % CATEGORIES.length]);
	}

	function setCategory(category){
		var body = $(document.body);
		body.removeClass(currentCategory);
		currentCategory = category;
		body.addClass(currentCategory);
		render();
	}

	function render(){
		var now = new Date();
		$('.categories .quarter').text('Q' + Math.ceil((now.getMonth() + 1)/3));
		$('.categories .month').text(MONTH_NAMES[now.getMonth()]);
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