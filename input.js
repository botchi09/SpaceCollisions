

function hookInput() {
	listener = new window.keypress.Listener()

	var my_defaults = {
		is_unordered    : true,
		prevent_repeat  : true  
	};

	var defaultKey = {
			"keys"          : "w",
			"is_exclusive"  : true,
			"is_unordered"	: true,
			"prevent_repeat": true,
			"on_keydown"    : function() {
			},
			"on_keyup"      : function(e) {
			},
			"this"          : this
		}

	var wKey = {...defaultKey}
	wKey.keys = "w"
	wKey.on_keydown = player.goForward
	wKey.on_keyup = player.stopForward
	
	var aKey = {...defaultKey}
	aKey.keys = "a"
	aKey.on_keydown = player.turnLeft
	aKey.on_keyup = player.stopLeft
	
	var sKey = {...defaultKey}
	sKey.keys = "s"
	sKey.on_keydown = player.goBack
	sKey.on_keyup = player.stopBack
	
	var dKey = {...defaultKey}
	dKey.keys = "d"
	dKey.on_keydown = player.turnRight
	dKey.on_keyup = player.stopRight
	
	var spaceKey = {...defaultKey}
	spaceKey.keys = "space"
	spaceKey.on_keydown = player.startShoot
	spaceKey.on_keyup = player.stopShoot
	
	var my_combos = listener.register_many([
		wKey,
		aKey,
		sKey,
		dKey,
		spaceKey
	]);
}