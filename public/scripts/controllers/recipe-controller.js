'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout, $location, Upload) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {image: null};
	$scope.file = null;
	$scope.uploadStatus = 'Click to add a new image';
	$scope.editing = false;

	$scope.editRecipe = function (bool) {
		if(bool) {
			$scope.editing = true;
		} else {
			$scope.editing = false;
			$scope.recipe.user = $scope.user;
			$http.post('/api/update-recipe', $scope.recipe).then(
				function (res) {
					$log.info(res.data);
				}, function (err) {
					$log.info(err);
				}
			);
		}
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
		$scope.$watch('file', function () {
			if($scope.file !== null) {
				$scope.uploadStatus = 'Image successfully uploaded!';
				Upload.upload({
					url: '/api/upload',
					method: 'POST',
					data: null,
					file: $scope.file
				}).then(function (res) {
					$scope.recipe.image = res.data.image;
				});
			}
		});
		$scope.$watch('$parent.user', function () {
			$scope.user = $scope.$parent.user;
		});
	}

	$timeout(init());
});