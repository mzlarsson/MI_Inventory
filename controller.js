
module.exports = function(model){

    const express = require("express");
    const router = express.Router();
	
	router.get("/", (req, res) => {
		res.render('main', {'exampleVar': 'some example'});
	});

	return router;
}