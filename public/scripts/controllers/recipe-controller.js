'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout, $location, Upload) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {};
	$scope.file = null;
	$scope.uploadStatus = 'Click to add an image';
	$scope.editing = false;

	$scope.editRecipe = function (bool) {
		if(bool) {
			$scope.editing = true;
		} else {
			$scope.editing = false;
			//Send the recipe update.
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
					$log.info(res);
				});
			}
		});
	}

	$timeout(init());
});