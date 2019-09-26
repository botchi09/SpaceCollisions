/*
TODO: Callback queue of clipping operations.
Clip operations are pushed into queue. On the next frame, do clipping. Each new frame do a new clip.
Or can we process all create and destroy calls on the same step?

*/

var clips = []


function ClipQueue() {
	
}