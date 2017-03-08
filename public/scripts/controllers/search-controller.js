'use strict';

angular.module('app').controller('searchController', function ($scope, $log, $http, $location, $timeout) {
	$scope.recipes = [];

	$scope.clicked = function (recipe) {
		$location.url('/recipe?id=' + recipe.id);
	};

	function getRecipes (searchTerm) {
		$http.get('/api/recipes?search=' + searchTerm).then(
			function (res) {
				$scope.recipes = res.data;
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init() {
		var searchTerm = $location.search().search;
		$scope.pageTitle = (searchTerm === ''? 'Showing all recipes' : 'Showing recipes matching "' + searchTerm + '"');
		getRecipes(searchTerm);
	}

	$timeout(init());
});