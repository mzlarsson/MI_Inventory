
module.exports = function(io){
	
	var model = {};
	model.visibility = true;
	model.money = 3;
	model.items = [];
	model.achievementsLeft = [
		createAchievement("twoflowers", "Röda och vita rosen", "Ha två blommor", () => count(model.items, "ros") == 2)
		/* TODO: Add more achievements */
	];
	model.achievementsDone = [];
	
    model.addItem = function(item){
		console.log('adding item');
		model.items.push(item);
		model.notifyItemList();
		model.checkAchievements();
	};
	
	model.removeItem = function(item){
		let index = model.items.indexOf(item);
		if (index >= 0){
			model.items.splice(index, 1);
			model.notifyItemList();
			model.checkAchievements();
		}
	};
	
	model.changeMoney = function(amount){
		model.money += amount;
		model.notifyMoney();
	};
	
	model.setVisible = function(visible){
		model.visibility = visible;
		model.notifyVisibility();
	};
	
	model.checkAchievements = function(){
		for (let i = 0; i<model.achievementsLeft.length; i++) {
			let achievement = model.achievementsLeft[i];
			if (achievement.validator()){
				model.achievementsDone.push(achievement);
				model.notifyAchievement(achievement);
				model.achievementsLeft.splice(i, 1);
				i--;
			}
		}
	};

	model.getAllAvailableItems = function(){
		return [
			createItem(1, "meddelande", "Meddelande", model.items)
		];
	};
	
	model.notifyItemList = function(){
		io.emit('items', model.items);
	};
	
	model.notifyAchievement = function(achievement){
		io.emit('achievement', {'name': achievement.name, 'title': achievement.title, 'description': achievement.description});
	};
	
	model.notifyMoney = function(){
		io.emit('money', model.money);
	};
	
	model.notifyVisibility = function(){
		io.emit('visible', model.visibility);
	};
	
	io.on('connection', function(socket){
		console.log('Client connected');
		socket.emit('items', model.items);
		socket.emit('money', model.money);
		socket.emit('visible', model.visibility);
	
		socket.on('additem', model.addItem);
		socket.on('removeitem', model.removeItem);
		socket.on('changemoney', model.changeMoney);
		socket.on('setvisible', model.setVisible);
	});
	
	return model;
};

function createAchievement(name, title, description, validator){
	return {'name': name, 'title': title, 'description': description, 'validator': validator};
}

function createItem(cost, name, description, addedItems){
	return {'name': name, 'description': description, 'cost': cost, 'added': count(addedItems, name) > 0};
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