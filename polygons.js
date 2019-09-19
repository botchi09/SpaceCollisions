
//https://observablehq.com/@tarte0/generate-random-simple-polygon
function generatePolygon(sides, scale) {
	
	//Create random points
	var points = []
	for (var i=0;i<sides;i++) {
		points.push([scale.x*(Math.random() - 0.5), scale.y*(Math.random() - 0.5)])
	}
	
	//Sort by angle
	points.sort(
		function(a, b) {
			//return dot_product(a,b) -  dot_product(b,a)
			return Math.atan2(b[0],b[1]) - Math.atan2(a[0],a[1])
		}
	)
	
	return points
}

function generateCircle(sides, scale, noise) {

	var nodes = []
	var width = (scale.x * 2)
	var height = (scale.y * 2)
	var angle = 1
	var x = 0
	var y = 0
	for (var i=0; i<sides; i++) {
		angle = (i / (sides/2)) * Math.PI
		x = (scale.x * Math.cos(angle)) + (width/2) + (Math.random() - 0.5)*noise*scale.x
		y = (scale.y * Math.sin(angle)) + (width/2) + (Math.random() - 0.5)*noise*scale.y
		nodes.push([x, y])
	}
	
	return nodes;
}


function triangulateConcavePolygon(polygon) {
	
	var newPolygons = []
	var oldPolygons = Array.from(polygon)

	var convexPolygons = decomp.quickDecomp(polygon)
	for (var poly in convexPolygons) {
		var points = convexPolygons[poly]
		var delaunay = Delaunator.from(points)

		var triangles = delaunay.triangles
		
		for (var i = 0; i < triangles.length; i += 3) {
			var newTri = []
		
			var p0 = triangles[i]
			var p1 = triangles[i + 1]
			var p2 = triangles[i + 2]
			newTri.push([points[p0][0], points[p0][1]])
			newTri.push([points[p1][0], points[p1][1]])
			newTri.push([points[p2][0], points[p2][1]])
			
			
			newPolygons.push(newTri)
			
			
		}

	}

	return {decomp: newPolygons, original: oldPolygons}
}

//TODO: Add Queue option so creating polygons in step doesn't happen
function createPolygon(allPolygons, ground, options) {
	var polygons = allPolygons.decomp
	var fullPoly = []
	var polyAnchor = ground
	var body = null
	
	if (!ground) {
		var bd = new b2BodyDef()
		bd.type = b2_dynamicBody
		if (options) {
			for (key in options) {
				bd[key] = options[key]
			}
		}
		
		var body = world.CreateBody(bd)
		polyAnchor = body
		//TODO: add getCurrentPoints function, which offsets current transform against originalPoints for clipping purposes
		body.originalPoints = allPolygons.original
		body.getCurrentPoints = function() {
			var offsetPoints = []
			var currentRadians = this.GetAngle()
			var currentPosition = this.GetPosition()
			
			for (point in this.originalPoints) {
				var curPoint = this.originalPoints[point]
				var curVector = new b2Vec2(curPoint[0], curPoint[1])
				var fullOffset = [curVector.x + currentPosition.x , curVector.y + currentPosition.y]

				offsetPoints.push(fullOffset)
				
			}
			//Rotate points
			offsetPoints = rotateAroundPoint(offsetPoints, currentPosition, currentRadians) 
			return offsetPoints
		}
	}

	for (var poly = 0; poly<polygons.length; poly++) {
		var shape = new b2PolygonShape()
		shape.vertices = tob2Vec2(polygons[poly])
		var density = 1
		if (options && options.density) {
			density = options.density
		}
		var newFixture = new b2FixtureDef()
		newFixture.shape = shape
		newFixture.density = density
		newFixture.isSensor = options.isSensor || false
		
		polyAnchor.CreateFixtureFromDef(newFixture)
		fullPoly.push(newFixture)
	}
	
	return body
}
/*
function createSensor(allPolygons) {
	var polygons = allPolygons.decomp
	var sensor = new b2BodyDef()
	sensor.shape = shape
	sensor.isSensor = true
	
	for (var poly = 0; poly<polygons.length; poly++) {
		var shape = new b2PolygonShape()
		shape.vertices = tob2Vec2(polygons[poly])
		var density = 1
		if (options && options.density) {
			density = options.density
		}
		var newFixture = sensor.CreateFixtureFromShape(shape, 0)
		fullPoly.push(newFixture)
	}
	
}*/

function doClip(body, body2, isUnion) {
	if (body && body2 && body.getCurrentPoints && body2.getCurrentPoints) {
		console.log("initialising clip")
		var cpr = new ClipperLib.Clipper()
		cpr.PreserveCollinear = true
		cpr.StrictlySimple = true

		var solutionPaths = []
		
		console.log("getting current points")
		var subjPath = toClipperPath(body2.getCurrentPoints())
		var clipPath = toClipperPath(body.getCurrentPoints())
		
		var scale = 1000

		ClipperLib.JS.ScaleUpPaths(subjPath, scale)
		ClipperLib.JS.ScaleUpPaths(clipPath, scale)
		cpr.AddPaths(clipPath, ClipperLib.PolyType.ptSubject, true)
		cpr.AddPaths(subjPath, ClipperLib.PolyType.ptClip, true)

		var clipType = ClipperLib.ClipType.ctUnion
		var fillType = ClipperLib.PolyFillType.pftEvenOdd
		
		if (!isUnion) {
			clipType = ClipperLib.ClipType.ctDifference	
		}
		console.log("CLIPPING!")
		var succeeded = cpr.Execute(clipType, solutionPaths, fillType, fillType)
		//console.log(solutionPaths, body.getCurrentPoints(), body2.getCurrentPoints())
		
		ClipperLib.JS.ScaleDownPaths(solutionPaths, scale)
		
		
		
		QueueDestroy(body)
		QueueDestroy(body2)
		
		
		//body.SetTransform(new b2Vec2(100, 100),0)
		//body2.SetTransform(new b2Vec2(100, 100),0)
		
		
		var clippedPolygon = fromClipperPath(solutionPaths)
		console.log("clipsolutions",clippedPolygon)
		console.log("solutions",solutionPaths)
		
		var bodies = []
		
		for (path in clippedPolygon) {
			var curPath = clippedPolygon[path]
			var triangulated3 = triangulateConcavePolygon(curPath)
			
			//TODO: Dynamic mass based on material
			//QueueExec(function() {createPolygon(triangulated3, false, {gravityScale:0, density: 5})})
			QueueCreate(triangulated3, false, {gravityScale:0, density: 5})
		}
		
		
		//return body3
		
	}
}