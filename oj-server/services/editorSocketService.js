var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECOUNDS = 3600;


module.exports = function(io) {

	// record all the participants in each session
	//send changes to all participants in a session
	var collaborations = {};

	// map from socketId to sessionId
	var socketIdToSessionId = {};

	var sessionPath = '/temp_sessions/';

	// when connection happens
	io.on('connection', (socket) => {
		let sessionId = socket.handshake.query['sessionId'];

		socketIdToSessionId[socket.id] = sessionId;
		
		//if sessionId is not in collaborations, it means no one does this problem before
		// if (!(sessionId in collaborations)) {
		// 	collaborations[sessionId] = {
		// 		'participants' : []
		// 	};
		// }
		// collaborations[sessionId]['participants'].push(socket.id);
		
		// at the begining of the connection, check if sessionId is in the collaborations. 
		// If not try to get from redis server.
		// If redis does not contain any information about this sessionId, 
		// create a session and put it into redis and collaborations

		if (sessionId in collaborations) {
			collaborations[sessionId]['participants'].push(socket.id);
		} else {

			redisClient.get(sessionPath = "/" + sessionId, function(data) {
				if (data) {
					console.log("session terminated previously, pulling back from Redis");
					collaborations[sessionId] = {
						'cachedInstructions' : JSON.parse(data),
						'participants' : []
					};
				} else {
					console.log("creating new session");
					collaborations[sessionId] = {
						'cachedInstructions' : [],
						'participants' : []
					};
				}
				collaborations[sessionId]['participants'].push(socket.id);
			})
		}


		socket.on('change', delta => {
			//log, easy for debuging
			console.log('change' + socketIdToSessionId[socket.id] + " " + delta);
			let sessionId = socketIdToSessionId[socket.id];

			if (sessionId in collaborations) {

				collaborations[sessionId]['cachedInstructions'].push(["change", delta, Date.now()])

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
		});

		socket.on('restoreBuffer', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('restore buffer for session: ' + sessionId + ', socket: ' + socket.id)

			if (sessionId in collaborations) {
				let instructions = collaborations[sessionId]['cachedInstructions'];
				for (var i = 0; i < instructions.length; i++) {
					socket.emit(instructions[i][0], instructions[i][1])
				}
			} else {
				console.log('warningZ; could not find any collaboration for this session');
			}
		});
		// io.to(socket.id).emit('message','hehe from server');
		socket.on('disconnect', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('socket: ' + socket.id + ' disconnected from session ' + sessionId);

			let foundAndRemove = false;
			if (sessionId in collaborations) {
				let participants = collaborations[sessionId]['participants'];
				let index = participants.indexOf(socket.id);
				if (index >= 0) {
					participants.splice(index, 1);
					foundAndRemove = true;

					if (participants.length == 0) {
						console.log('last participant in collaboration, committing to redis');
						let key = sessionPath = "/" + sessionId;
						let value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);

						redisClient.set(key, value, redisClient.redisPrint);
						redisClient.expire(key, TIMEOUT_IN_SECOUNDS);

						delete collaborations[sessionId];
					}
				}
			}

			if (!foundAndRemove) {
				console.log("warning: could not tie socket id to any collaboration");
			}

			console.log(collaborations);
		});
	})  
} 


