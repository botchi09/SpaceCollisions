player = {body: null, think: null, init: null} //Physical body controlled by player.

var forwardHeld = false
var backHeld = false
var leftHeld = false
var rightHeld = false

var density = 0
var turnThrust = 0
var maxAngularVelocity = 3.35
var curLeftTorque = 0

var maxForwardVelocity = 3
var forwardThrust = 0

player.init = function() {
	var turnThrustMultiplier = 0.1
	var forwardThrustMultiplier = 1
	console.log(player)
	density = player.body.fixtures[0].density
	turnThrust = turnThrustMultiplier*density
	forwardThrust = forwardThrustMultiplier*density
	player.body.onHit = function(contact) {
		//TODO: damage? effect
		console.log("ouch!")
	}
	
}

player.updateCamera = function() {
	//TODO: center this
	var pos = player.body.GetWorldCenter()
	camera.position.x = pos.x
	camera.position.y = pos.y
}

player.think = addTickFunction(function(time) {
	
	player.updateCamera()
	
	var curAngularVelocity = player.body.GetAngularVelocity()
	if (leftHeld) {
		if (curAngularVelocity <= maxAngularVelocity) {
			curLeftTorque += turnThrust
			player.body.ApplyTorque(turnThrust, true)
		}

	}
	if (rightHeld) {
		if (curAngularVelocity >= -maxAngularVelocity) {
			curLeftTorque -= turnThrust
			player.body.ApplyTorque(-turnThrust, true)
		}
	}
	
	
	var curLinearVelocity = player.body.GetLinearVelocity()
	//Rotate linear velocity by angle, take Y coord for forward velocity
	var curForwardSpeed = rotateVector([-curLinearVelocity.x,curLinearVelocity.y],new b2Vec2(0,0),player.body.GetAngle())[1]
	var dir = player.getDirection()
	if (forwardHeld) {
		if (curForwardSpeed <= maxForwardVelocity) {
			player.body.ApplyForceToCenter(new b2Vec2(dir.x*forwardThrust, dir.y*forwardThrust), true)
		}
	}
	if (backHeld) {
		if (-curForwardSpeed <= maxForwardVelocity) {
			player.body.ApplyForceToCenter(new b2Vec2(dir.x*-forwardThrust, dir.y*-forwardThrust), true)
		}
	}
	
})

player.getDirection = function() {
	var rightDir = player.body.GetTransform().q.GetXAxis()
	return new b2Vec2(-rightDir.y, rightDir.x)
}


player.goForward = function() {
	forwardHeld = true
}
player.stopForward = function() {
	forwardHeld = false
}

player.goBack = function() {
	backHeld = true
}
player.stopBack = function() {
	backHeld = false
}


player.turnLeft = function() {
	leftHeld = true
}
player.stopLeft = function() {
	curLeftTorque = 0
	leftHeld = false
}

player.turnRight = function() {
	rightHeld = true
	
}
player.stopRight = function() {
	curLeftTorque = 0
	rightHeld = false
}

player.startShoot = function() {
	var linearV = player.body.GetLinearVelocity()
	var dirV = player.getDirection()
	var posV = player.body.GetWorldCenter()
	
	var bulletSpeed = 10
	var bulletStartMult = 3
	
	QueueExec(function() {
		
		var bullet = createBullet({
			origin: new b2Vec2(posV.x + dirV.x * bulletStartMult, posV.y + dirV.y * bulletStartMult),
			velocity: new b2Vec2(linearV.x + dirV.x * bulletSpeed, linearV.y + dirV.y * bulletSpeed),
			shape: generateCircle(10, {x:0.1, y:0.15}, 0),
			angle: player.body.GetAngle()
		})
		
		bullet.onHit = function(collision, contact) {
			var pos = this.GetPosition() //save as value
			QueueDestroy(this)
			this.onHit = null

			doExplosion(pos, 2)
				
		}
	})
}
player.stopShoot = function() {
}