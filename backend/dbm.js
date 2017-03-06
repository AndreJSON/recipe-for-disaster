'use strict';

var Sequelize = require('sequelize');

var seq = new Sequelize('rfd', 'postgres', null, {
	host: 'localhost',
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	logging: true //Set to true if debugging needed.
});

var model = require('./model.js')(seq); //Create the models.

exports.addRecipe = function (authorId, name, image, freetext, tags) {
	return model.Recipes.create({
		authorId: authorId,
		name: name,
		image: image,
		freetext: freetext,
		tags: tags
	});
};

exports.addComment = function (recipeId, authorId, freetext) {
	return model.Comments.create({
		recipeId: recipeId,
		authorId: authorId,
		freetext: freetext
	});
};

exports.getRecipes = function () {
	return model.Recipes.findAll();
};

exports.getComments = function (recipeId) {
	return model.Comments.findAll({
		where: {
			recipeId: recipeId
		}
	});
};