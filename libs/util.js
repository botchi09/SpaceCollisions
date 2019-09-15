
function vectorNormal(x, y) {
	var length = Math.sqrt(x*x+y*y)
	x = x/length
	y = y/length
	return [x, y]
}

//https://rosettacode.org/wiki/Dot_product#JavaScript
function dot_product(ary1, ary2) {
    if (ary1.length != ary2.length)
        throw "can't find dot product: arrays have different lengths";
    var dotprod = 0;
    for (var i = 0; i < ary1.length; i++)
        dotprod += ary1[i] * ary2[i];
    return dotprod;
}
 
//print(dot_product([1,3,-5],[4,-2,-1])); // ==> 3
//print(dot_product([1,3,-5],[4,-2,-1,0])); // ==> exception


function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}



function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min
}

function tob2Vec2(array) {
	return transformToType(array, true)
}

function toPointArray(array) {
	return transformToType(array, false)
}

function transformToType(array, inb2Vec2) {
	var vertices = []
	for (var i=0;i<array.length;i++) {
		if (!inb2Vec2) {
			vertices[i] = [array[i].x, array[i].y]
		} else {
			vertices[i] = new b2Vec2(array[i][0], array[i][1])
		}
	}
	return vertices
}
	
//Takes PointArray ONLY. Converts to clipper path
function toClipperPath(array) {
	var clipPaths = new ClipperLib.Paths()
	var clipPath = new ClipperLib.Path()
	for (point in array) {
		var newPoint = new ClipperLib.IntPoint(array[point][0], array[point][1])
		clipPath.push(newPoint)
	}
	clipPaths.push(clipPath)
	
	return clipPaths
}

function fromClipperPath(paths) {
	var transformed = []
	for (path in paths) {
		transformed[path] = []
		for (var point in paths[path]) {
			transformed[path].push([paths[path][point].X, paths[path][point].Y])
		}
	}
	//console.log("transformed:",transformed, paths)
	return transformed
}
	
//Add static path to canvas. largely debug function
function drawPath(path) {
	var material = new THREE.LineBasicMaterial( { color: 0x0000ff } )

	var geometry = new THREE.Geometry()
	
	for (p in path) {
		geometry.vertices.push(new THREE.Vector3( path[0], path[1], 0) )
	}


	var line = new THREE.Line( geometry, material )
	scene.add( line )
}
	
function rotateVector(vector, origin, theta) {
	var ox = origin.x
	var oy = origin.y
	var newX = (ox + Math.cos(theta) * (vector[0] - ox) - Math.sin(theta) * (vector[1] - oy))
	var newY = (oy + Math.sin(theta) * (vector[0] - ox) + Math.cos(theta) * (vector[1] - oy))
	return [newX, newY]
}
	
	
	
	
	
	
	
	
	
	
	
	