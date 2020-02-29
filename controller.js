
module.exports = function(model){

    const express = require("express");
    const router = express.Router();
	
	router.get("/", (req, res) => {
		res.render('main', {});
	});
	
	router.get("/update", (req, res) => {
		res.render('update', {});
	});

	return router;
}