'use strict';

var Sequelize = require('sequelize');

module.exports = function (seq) {
	var model = {};

	model.Users = seq.define('users', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING
		},
		hash: {
			type: Sequelize.STRING
		},
		salt: {
			type: Sequelize.STRING
		}
	});

	model.Recipes = seq.define('recipes', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		authorId: {
			type: Sequelize.INTEGER
		},
		name: {
			type: Sequelize.STRING
		},
		image: {
			type: Sequelize.STRING
		},
		freetext: {
			type: Sequelize.STRING
		},
		tags: {
			type: Sequelize.ARRAY(Sequelize.STRING)
		}
	});

	model.Comments = seq.define('comments', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		recipeId: {
			type: Sequelize.INTEGER
		},
		authorId: {
			type: Sequelize.INTEGER
		},
		freetext: {
			type: Sequelize.STRING
		}
	});

	return model;
}