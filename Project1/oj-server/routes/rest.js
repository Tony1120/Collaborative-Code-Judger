const express = require('express');
const router = express.Router();


const problemService = require('../services/problemService');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/problems', function(req,res){
	problemService.getProblems()
		.then(problems => res.json(problems));
});


router.get('/problems/:id', function(req,res){
	const id = req.params.id;
	problemService.getProblem(+id)
		.then(problem => res.json(problem));
});


router.post('/problems', jsonParser, (req,res)=> {
	//console.log(req.body);
	problemService.addProblem(req.body)
		.then(problems => {
			//res.status(500).send(req.body)
			//console.log(problems);
			res.json(problems);
		}, (error) => {
			res.status(400).send('Problem name already exists!');
		});
});


module.exports = router;