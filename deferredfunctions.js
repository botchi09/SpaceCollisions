var destroyQueue = [] //Bodies to be destroyed after step
var createQueue = []
var functionQueue = [] //Usually used to create bodies with specific parameters


function ExecFunctionQueue() {
	var newFunctionQueue = []
	
	for (func in functionQueue) {
		var curFunc = functionQueue[func]
		if (curFunc.stepDelay <= 0) {
			curFunc.func()
		} else {
			curFunc.stepDelay--
			newFunctionQueue.push(curFunc)
		}
	}
	functionQueue = newFunctionQueue
}

function DestroyBodyQueue() {
	for (body in destroyQueue) {
		world.DestroyBody(destroyQueue[body])
	}
	destroyQueue = []
}

function CreateBodyQueue() {
	for (body in createQueue) {
		//world.CreateBody(createQueue[body])
		createPolygon(createQueue[body].triangulated, createQueue[body].isGround, createQueue[body].options)
	}
	createQueue = []
}

function QueueDestroy(body) {
	destroyQueue.push(body)
}

function QueueCreate(triangulated, isGround, options) {
	createQueue.push({triangulated: triangulated, isGround: isGround, options: options})
}

//Deferred function until AFTER steps. frameDelay defers execution an extra number of frames
function QueueExec(func, stepDelay) {
	functionQueue.push({func: func, stepDelay: stepDelay || 0})
}


function DeferredFunctionsExec() {
	
	DestroyBodyQueue()
	CreateBodyQueue()
	ExecFunctionQueue()
	ClipQueue()
	
}