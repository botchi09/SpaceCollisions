var updateFuncs = [] //Globally updated functions run every frame
var fps = 60

function update() {
	for (func in updateFuncs) {
		if (updateFuncs[func]) {
			updateFuncs[func](Date.now())
		}
	}
	setTimeout(update, 1000/60)
}

function addTickFunction(func) {
	updateFuncs.push(func)
	return func
}

update()