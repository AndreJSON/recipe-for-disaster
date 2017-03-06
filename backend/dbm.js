'use strict';

var bcrypt = require('bcypt');

var sequelize = require('sequelize');
var conn = new sequelize('rfd', 'postgres', null, {
	host: 'localhost',
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	logging: true //Set to true if debugging needed.
});

var model = require('./model.js')(conn); //Create the models.

exports.addUser = function (name, password) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return model.Users.create({
		name: name,
		salt: salt,
		hash: hash
	});
};

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

exports.getRecipe = function (recipeId) {
	return model.Recipes.findOne({
		where: {
			id: recipeId
		}
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