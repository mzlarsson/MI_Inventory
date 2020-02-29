
module.exports = function(io){
	
	var model = {};
	model.items = [];
	model.achievementsLeft = [
		createAchievement("twoflowers", "Röda och vita rosen", "Ha två blommor", () => count(model.items, "ros") == 2)
		/* TODO: Add more achievements */
	];
	model.achievementsDone = [];
	
    model.addItem = function(item){
		console.log('adding item');
		model.items.push(item);
		model.updateClientsItemList();
		model.checkAchievements();
	};
	
	model.removeItem = function(item){
		let index = model.items.indexOf(item);
		if (index >= 0){
			model.items.splice(index, 1);
			model.updateClientsItemList();
			model.checkAchievements();
		}
	};
	
	model.checkAchievements = function(){
		for (let i = 0; i<model.achievementsLeft.length; i++) {
			let achievement = model.achievementsLeft[i];
			if (achievement.validator()){
				model.achievementsDone.push(achievement);
				model.notifyClientAchievement(achievement);
				model.achievementsLeft.splice(i, 1);
				i--;
			}
		}
	};
	
	model.updateClientsItemList = function(){
		io.emit('items', model.items);
	};
	
	model.notifyClientAchievement = function(achievement){
		io.emit('achievement', {'name': achievement.name, 'title': achievement.title, 'description': achievement.description});
	};
	
	io.on('connection', function(socket){
		console.log('Client connected');
		socket.emit('items', model.items);
	
		socket.on('additem', model.addItem);
		socket.on('removeitem', model.removeItem);
	});
	
	return model;
};

function createAchievement(name, title, description, validator){
	return {'name': name, 'title': title, 'description': description, 'validator': validator};
}

function count(arr, element){
	let count = 0;
	let start = 0;
	while((start = arr.indexOf(element, start)) >= 0){
		count++;
		start += 1;
	}
	return count;
}