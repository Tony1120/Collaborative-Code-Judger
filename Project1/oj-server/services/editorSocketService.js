module.exports = function(io) {

	// record all the participants in each session
	//send changes to all participants in a session
	var collaborations = {};

	// map from socketId to sessionId
	var socketIdToSessionId = {};


	// when connection happens
	io.on('connection', (socket) => {
		let sessionId = socket.handshake.query['sessionId'];

		socketIdToSessionId[socket.id] = sessionId;
		
		//if sessionId is not in collaborations, it means no one does this problem before
		if (!(sessionId in collaborations)) {
			collaborations[sessionId] = {
				'participants' : []
			};
		}

		collaborations[sessionId]['participants'].push(socket.id);
		
		socket.on("change", delta => {
			//log, easy for debuging
			console.log('change' + socketIdToSessionId[socket.id] + " " + delta);
			let sessionId = socketIdToSessionId[socket.id];

			if (sessionId in collaborations) {
								//get all participants in this session
				let participants = collaborations[sessionId]['participants'];

				//send changes to all participants
				for (let i = 0; i < participants.length; i++) {
	
					// skip the one who created this change
					if (socket.id != participants[i]) {
						
						io.to(participants[i]).emit("change", delta);
					}
				}
			} else {
				console.log("could not tie socket id to any collaborations");
			}


		})

		// var message = socket.handshake.query['message'];
		// console.log(message);
		// io.to(socket.id).emit('message','hehe from server');
	})
}   


