
function indexExistsInBodies(bodies, lindex) {
	for (body in bodies) {
		if (bodies[body].lindex == lindex) {
			return true
		}
	}
	return false
}

//TODO: Convert all explosion to SENSORS!
var contactListener = {
	BeginContactBody: function(contact) {
		var contactA = contact.GetFixtureA()
		var contactB = contact.GetFixtureB()
		console.log("CONTACT", contact)
		
		var explosionBody = null
		var explosionSubject = null
		
		if (contactA.body.isExplosion) {
			explosionBody = contactA.body
			explosionSubject = contactB.body
		}
		
		if (contactB.body.isExplosion) {
			explosionBody = contactB.body
			explosionSubject = contactA.body
		}
		
		
		//TODO: Provisional explosion clipping code. Very inefficient. Scales poorly with large num of bodies.
			for (var body in world.bodies) {
				var curBody = world.bodies[body]
				if (!curBody.isClipping) {
					if (explosionBody && curBody && curBody.lindex != explosionBody.lindex) {
						curBody.isClipping = true
						QueueExec(function() {	
							
							//doClip(curBody, explosionBody, false)
						},1)
					}
				}
			}
		
		
		/*if (explosionBody && explosionBody.isExplosion && explosionSubject
		&& !(explosionBody.isExplosion && explosionSubject.isExplosion)) {

			if (!explosionBody.contactList) {
				explosionBody.contactList = []
			}
			if (explosionBody.lindex != explosionSubject.lindex
				&& !indexExistsInBodies(explosionBody.contactList, explosionSubject.lindex)
				&& explosionBody.isExplosion && !explosionSubject.isExplosion && !explosionSubject.exploded) {
				
				if (explosionSubject.isExplosive) {
					//explosionSubject.onHit = null
					//QueueDestroy(explosionSubject)
					
				} else {
					explosionSubject.exploded = true
					explosionBody.contactList.push(explosionSubject)
				}
			}
			console.log("cur subject", explosionSubject, explosionBody.contactList)
			//TODO:Issue of multiple weird clips happening if two explosion get ahold of the same data
			QueueExec(function() {
				if (!explosionBody.hasTicked) {
					explosionBody.hasTicked = true
					//explosionBody.isExplosion = false
					
					
					console.log("BOOM",explosionBody.contactList)
					if (explosionBody.contactList.length > 0) {
						for (var subject in explosionBody.contactList) {
							var curSubject = explosionBody.contactList[subject]
							if ( !curSubject.isExplosion
							&& curSubject !== null && curSubject !== undefined) {
								doClip(curSubject, explosionBody, false)
								console.log("subject: ",curSubject)

							}
							
						}
					} else {
						QueueDestroy(explosionBody)
					}
				
					
				}
			},1)
			
		}*/
		
		if (contactA.body.onHit) {
			contactA.body.onHit(contactB, contact) //Overload with contact struct. 1st arg provided to avoid confusion.
		}
		if (contactB.body.onHit) {
			contactB.body.onHit(contactA, contact)
		}
	
		
	}
}


function createContactListener() {
	console.log("Contact listener created")
	world.SetContactListener(contactListener)

	
}
