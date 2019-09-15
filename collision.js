
function indexExistsInBodies(bodies, lindex) {
	for (body in bodies) {
		if (bodies[body].lindex == lindex) {
			return true
		}
	}
	return false
}

var contactListener = {
	PreSolve: function(contact) {
		var contactA = contact.GetFixtureA()
		var contactB = contact.GetFixtureB()
		
		
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
		
		if (explosionBody && explosionBody.isExplosion) {
			if (!explosionBody.contactList) {
				explosionBody.contactList = []
			}
			if (explosionBody.lindex != explosionSubject.lindex
				&& !indexExistsInBodies(explosionBody.contactList, explosionSubject.lindex)
				&& explosionBody.isExplosion && !explosionSubject.isExplosion) {
				
				if (explosionSubject.isExplosive) {
					explosionSubject.onHit = null
					QueueDestroy(explosionSubject)
				} else {
					explosionBody.contactList.push(explosionSubject)
				}
			}
			
			if (!explosionBody.hasTicked) {
				explosionBody.hasTicked = true
				explosionBody.isExplosion = false
				QueueExec(function() {
					
					console.log("BOOM",explosionBody.contactList)
					if (explosionBody.contactList.length != 0) {
						for (var subject in explosionBody.contactList) {
							
							doClip(explosionBody.contactList[subject], explosionBody, false)
							
						}
					} else {
						QueueDestroy(explosionBody)
					}
			
				})
			}
			
		}
		
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
