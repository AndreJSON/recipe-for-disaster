'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout, $location, Upload) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {image: null};
	$scope.comments = [];
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

	$scope.sendComment = function () {
		$http.post('/api/new-comment', {recipeId: $location.search().id, freetext: $scope.comment, username: $scope.user}).then(
			function (res) {
				if(res.data.success) {
					$scope.comments.push(res.data.comment);
					$scope.comment = '';
					$scope.commentForm.$setPristine();
					$scope.commentForm.$setUntouched();
				}
			}, function (err) {
				$log.info(err);
			}
		);
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

	function getComments () {
		$http.get('/api/comments/' + $location.search().id).then(
			function (res) {
				$scope.comments = res.data;
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init () {
		getRecipe();
		getComments();
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
		$scope.$watch('$parent.usernames', function () {
			$scope.usernames = $scope.$parent.usernames;
		});
	}

	$timeout(init());
});