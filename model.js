
const fs = require("fs");

module.exports = function(io){
	
	var model = {};
	model.visibility = true;
	model.money = 3;
	model.availableItems = [];
	model.items = [];
	model.achievementsLeft = [];
	model.achievementsDone = [];

	model.loadData = function() {
		const rawStaticData = fs.readFileSync("res/static_data.json");
		const staticData = JSON.parse(rawStaticData);
		model.availableItems = staticData.items;
		model.achievementsLeft = staticData.achievements.map(createAchievement);
	};
	
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
			if (model.checkAchievement(achievement)){
				model.requestValidateAchievement(achievement);
			}
		}
	};

	model.checkAchievement = function(achievement) {
		if (!achievement.requirements) {
			return false;
		}

		for (const req of achievement.requirements) {
			if (req.items && req.amount) {
				if (req.items.reduce((sum, x) => sum + countItem(x), 0) >= req.amount) {
					return true;
				}
			}
			else if (req.item && req.amount) {
				if (countItem(req.item) >= req.amount) {
					return true;
				}
			}
		}

		return false;
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
		return this.availableItems.map(x => {
			return {...x, added: countItem(x.name) > 0};
		});
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
	

	function createAchievement(data){
		return {'name': data.key, 'title': data.title, 'description': data.desc, 'requirements': data.requirements || null};
	}

	function countItem(element){
		return model.items.reduce((sum, el) => el == element ? sum+1 : sum, 0);
	}
	
	return model;
};