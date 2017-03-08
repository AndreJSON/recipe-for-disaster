'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout, $location, Upload) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {};

	$scope.editRecipe = function () {

	};

	function getRecipe () {
		$http.get('/api/recipe/' + $location.search().id).then(
			function (res) {
				$scope.recipe = res.data;
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init () {
		getRecipe();
	}

	$timeout(init());
});