
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
				model.requestValidateAchievement(achievement);
			}
		}
	};
	
	model.activateAchievement = function(name){
		for (let i = 0; i<model.achievementsLeft.length; i++) {
			let achievement = model.achievementsLeft[i];
			if (achievement.name == name){
				model.achievementsDone.push(achievement);
				model.notifyAchievement(achievement);
				model.achievementsLeft.splice(i, 1);
				break;
			}
		}
	};

	model.getAllAvailableItems = function(){
		return [
			createItem(0, "notes", "Anteckningar", model.items),
			createItem(0, "avgudastaty", "Avgudastaty", model.items),
			createItem(0, "blomma", "Blomma", model.items),
			createItem(1, "ros", "Ros", model.items),
			createItem(0, "citron", "Citron", model.items),
			createItem(0, "devils_root", "Djävulsrot", model.items),
			createItem(0, "skull", "Dödskalle", model.items),
			createItem(0, "featherpen", "Fjäderpenna", model.items),
			createItem(0, "fil", "Fil", model.items),
			createItem(0, "flaska", "Flaska", model.items),
			createItem(0, "flaskpost", "Flaskpost", model.items),
			createItem(0, "forstoringsglas", "Förstoringsglas", model.items),
			createItem(0, "icecream", "Glass", model.items),
			createItem(3, "grogg", "Grogg", model.items),
			createItem(0, "gummikyckling", "Gummikyckling", model.items),
			createItem(0, "guvernorsbalte", "Guvernörsbälte", model.items),
			createItem(0, "hatt", "Hatt", model.items),
			createItem(0, "kniv", "Kniv", model.items),
			createItem(0, "kompass", "Kompass", model.items),
			createItem(0, "kors", "Kors", model.items),
			createItem(0, "kulor", "Kulor", model.items),
			createItem(0, "lechuck_sword", "LC Svärd", model.items),
			createItem(0, "map_part1", "Karta del 1", model.items),
			createItem(0, "map_part2", "Karta del 2", model.items),
			createItem(0, "medalj", "Medalj", model.items),
			createItem(1, "meddelande", "Meddelande", model.items),
			createItem(0, "pinnar", "Pinnar", model.items),
			createItem(0, "pistol", "Pistol", model.items),
			createItem(0, "planka", "Planka", model.items),
			createItem(0, "recept", "Recept", model.items),
			createItem(1, "rep", "Rep (203m)", model.items),
			createItem(0, "ritualdolk", "Ritualdolk", model.items),
			createItem(0, "romflaska", "Romflaska", model.items),
			createItem(0, "skattkista", "Skattkista", model.items),
			createItem(0, "skelettben", "Skelettben", model.items),
			createItem(0, "skiffernyckel", "Skiffernyckel", model.items),
			createItem(0, "spade", "Spade", model.items),
			createItem(0, "surstromming", "Surströmming", model.items),
			createItem(0, "tarta", "Tårta", model.items),
			createItem(0, "tshirt", "T-shirt", model.items),
			createItem(0, "varja", "Värja", model.items),
			createItem(0, "ved", "Ved", model.items)
		];
	};
	
	model.getAllAvailableAchievements = function(){
		return model.achievementsLeft.map(x => ({'name': x.name, 'title': x.title, 'description': x.description}));
	};
	
	model.notifyItemList = function(){
		io.emit('items', model.items);
	};
	
	model.requestValidateAchievement = function(achievement){
		io.emit('validateachievement', {'name': achievement.name, 'title': achievement.title, 'description': achievement.description});
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
		socket.emit('achievements', model.achievementsDone);
	
		socket.on('additem', model.addItem);
		socket.on('removeitem', model.removeItem);
		socket.on('changemoney', model.changeMoney);
		socket.on('setvisible', model.setVisible);
		socket.on('activateachievement', model.activateAchievement);
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