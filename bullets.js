//Bullet struct
/*
shape
init
onHit
think
size
origin
angle
raycast
velocity
*/

//TODO: bullets

function createBullet(bulletStruct) {
	if (!bulletStruct.raycast) {
		
		var polygon = bulletStruct.shape
		var triangulated = triangulateConcavePolygon(polygon)
		var body = createPolygon(triangulated, false, {gravityScale:0, density: 0.1, isBullet: true})
		//console.log(polygon, triangulated, body)
		body.SetTransform(bulletStruct.origin, bulletStruct.angle || 0)
		body.SetLinearVelocity(bulletStruct.velocity || new b2Vec2(0, 0))
		body.onHit = bulletStruct.onHit
		body.isExplosion = bulletStruct.isExplosion
		
		//Marks as bullet without duplicating isBullet function of Box2D
		if (!body.isExplosion) {
			body.isExplosive = true
		}
		//body.onHit = bulletStruct.onHit.bind({});
		if (bulletStruct.think) {
			addTickFunction(function(){bulletStruct.think(body)})
		}
		return body
	}
}

//Convenience difference clipping function
function doExplosion(origin, radius) {
	//lindex to avoid clipping myself
	
	console.log("me",this)
	QueueExec(function() {
		var explosion = createBullet({
			isExplosion: true,
			shape: generateCircle(radius*10, new b2Vec2(radius, radius), 0),
			origin: new b2Vec2(origin.x-radius, origin.y-radius)
			
		})
	})
}