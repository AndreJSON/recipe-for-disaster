'use strict';

var bcrypt = require('bcrypt');
var sequelize = require('sequelize');
var conn = new sequelize('rfd', 'postgres', null, {
	host: 'localhost',
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	logging: false
});

var model = require('./model.js')(conn); //Create the models.

/**
 * Adds a new user to the database with the specified login credentials.
 * Passwords are not stored.
 * Password hash is computed using bcrypt.
 */
exports.addUser = function (name, password) {
	var salt = bcrypt.genSaltSync(10);
	var hash;
	if(password !== '') { //Allow empty password.
		hash = bcrypt.hashSync(password, salt);
	} else {
		hash = '';
	}
	return model.Users.create({
		name: name,
		salt: salt,
		hash: hash
	});
};

exports.addRecipe = function (authorId, name, image, freetext, tags) {
	for(var i = 0; i < tags.length; i++) {
		tags[i] = tags[i].toLowerCase();
	}
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

/**
 * Updates the recipe specified through id, with the new information specified.
 * Converts all tags to lower case before insertion.
 */
exports.updateRecipe = function (recipeId, name, image, freetext, tags, deleteImage) {
	for(var i = 0; i < tags.length; i++) {
		tags[i] = tags[i].toLowerCase();
	}
	var updateObj = {
		name: name,
		freetext: freetext,
		tags: tags
	};
	if(image !== null) { //No new image was specified, so use the old one.
		updateObj.image = image;
	} else if (deleteImage) { //User has actively deleted image.
		updateObj.image = null;
	}
	return model.Recipes.update(updateObj,{
		where: {
			id: recipeId
		}
	});
};

exports.getUser = function (name) {
	return model.Users.findOne({
		where: {
			name: name
		}
	});
};

exports.getUserFromId = function (id) {
	return model.Users.findOne({
		where: {
			id: id
		}
	});
};

exports.getUsernames = function () {
	return model.Users.findAll({
		attributes: ['id', 'name'],
		order: [['id', 'ASC']]
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
	return model.Recipes.findAll({
		order: [['name', 'ASC']]
	});
};

exports.getComments = function (recipeId) {
	return model.Comments.findAll({
		where: {
			recipeId: recipeId
		}
	});
};