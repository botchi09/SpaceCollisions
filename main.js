var terrain = [] //Fixed position
var physObjs = [] //physics objects
var listener = null

var bd = null
var ground = null

function init() {
	initTestbed(800, 600)

	camera.position.y = 4
	camera.position.z = 8
	bd = new b2BodyDef()
	ground = world.CreateBody(bd)
	
	QueueExec(function() {
		playground()
	})
	
}


//[x, y] array, b2Vec2 origin, theta radians
function rotateAroundPoint(array, origin, theta) {
	var rotatedPoints = []

	for (var i in array) {
		rotatedPoints.push(rotateVector(array[i], origin, theta))
	}
	
	return rotatedPoints
}



//TODO: WTF why is there an invisible box
function playground() {
	createContactListener()

	var playerTriangulated = triangulateConcavePolygon([[0,0],[0.6,0],[0.3,1]])
	var playerBody = createPolygon(playerTriangulated, false, {gravityScale:0, density: 1})
	player.body = playerBody
	playerBody.SetTransform(new b2Vec2(3,2),0)
	
	hookInput()
	player.init()

	//var polygon = generatePolygon(6, {x: 2, y: 5})
	var polygon = generateCircle(30, {x: 3, y: 3}, 0.3)

	var triangulated = triangulateConcavePolygon(polygon)
	
	var body = createPolygon(triangulated, false, {gravityScale:0, density: 1})
	body.SetTransform(new b2Vec2(-4,2),0)
	//body.SetAngle(1)
	
	/*
	var polygon2 = generateCircle(30, {x: 2, y: 1}, 0.3)

	var triangulated2 = triangulateConcavePolygon(polygon2)
	
	var body2 = createPolygon(triangulated2, false, {gravityScale:0, density: 1})
	//body2.SetTransform(new b2Vec2(-6,3.5),-1.5)
	body2.SetTransform(new b2Vec2(-1,3),1.8)
		*/
	

	/*var body3 = doClip(body, body2, true)
	
	var polygonBoom = generateCircle(10, {x: 2, y: 0.1}, 0.5)
	var triangulatedBoom = triangulateConcavePolygon(polygonBoom)
	
	var bodyBoom = createPolygon(triangulatedBoom, false, {gravityScale:0, density: 1})
	bodyBoom.SetTransform(new b2Vec2(1.1,3),1.8)
	
	doClip(body3, bodyBoom, false)*/
	
	//Edge shapes do not play nice with clipping
	
	//Ground
	/*var shape = new b2EdgeShape;
	shape.Set(new b2Vec2(-50.0, -1.0), new b2Vec2(50.0, -1.0));
	ground.CreateFixtureFromShape(shape, 0.0);*/
	
	/*var psd = new b2ParticleSystemDef()
	psd.radius = 0.035
	var particleSystem = world.CreateParticleSystem(psd)
	
	// one group
	var circle = new b2CircleShape()
	circle.position.Set(0, 3)
	circle.radius = 2
	var pgd = new b2ParticleGroupDef()
	
	pgd.shape = circle
	pgd.color.Set(255, 0, 0, 255)
	particleSystem.CreateParticleGroup(pgd)
	
	var box = new b2PolygonShape();
	var pgd = new b2ParticleGroupDef();
	box.SetAsBoxXY(0.5, 0.5);
	pgd.flags = b2_elasticParticle;
	pgd.groupFlags = b2_solidParticleGroup;
	pgd.position.Set(1, 7);
	pgd.angle = -0.5;
	pgd.angularVelocity = 0;
	pgd.shape = box;
	pgd.color.Set(0, 0, 255, 255);
	particleSystem.CreateParticleGroup(pgd);

	// circle
	bd = new b2BodyDef()
	var circle = new b2CircleShape()
	bd.type = b2_dynamicBody
	var body = world.CreateBody(bd)
	circle.position.Set(0, 8)
	circle.radius = 0.5
	body.CreateFixtureFromShape(circle, 0.5)
	
	var lowerBound = 2;
	var upperBound = 3;
	var data = [
		[18, 13, 10,  9, 10, 13, 18],
		[13,  8,  5,  4,  5,  8, 13],
		[10,  5,  2,  1,  2,  5, 10],
		[ 9,  4,  1, 12,  1,  4,  9],
		[10,  5,  2,  1,  2,  5, 10],
		[13,  8,  5,  4,  5,  8, 13],
		[18, 13, 10,  9, 10, 13, 18],
		[18, 13, 10,  9, 10, 13, 18]
	];

	var bandWidth = upperBound - lowerBound;
	var band = MarchingSquaresJS.isoBands(data, lowerBound, bandWidth);
	//console.log(band)
	
	//createTerrainFromPoly(band, -3, -3, 2)
	
	//var triangulated2 = triangulateConcavePolygon(band)
	
	//createPolygon(triangulated2)
	
	var lowerBound = 0;
	var upperBound = 1;
	var data = generateCellMap(20, 20)
	//console.log(data)
	var bandWidth = upperBound - lowerBound;
	var band = MarchingSquaresJS.isoBands(data, lowerBound, 0.5);
	//console.log(band)
	
	//createTerrainFromPoly(band, -3, -1, 1)
	
	
	//var triangulated3 = triangulateConcavePolygon(band)
	
	//createFixedPolygon(triangulated3)*/
	
}

