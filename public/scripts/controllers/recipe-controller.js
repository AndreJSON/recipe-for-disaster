'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout, $location, $mdDialog, Upload) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {image: null};
	$scope.comments = [];
	$scope.file = null;
	$scope.uploadStatus = 'Click to add a new image';
	$scope.editing = false;

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

	/**
	 * Toggles editing mode according to the input boolean.
	 * If editing is toggled off, any changes made a commited to the server over http.
	 */
	$scope.editRecipe = function (bool, action, ev) {
		if(bool) {
			$scope.editing = true;
		} else {
			if(action === 'save') {
				$scope.editing = false;
				$scope.recipe.user = $scope.user;
				$http.post('/api/update-recipe', JSON.stringify($scope.recipe)).then(
					function (res) {
						$log.info(res.data);
					}, function (err) {
						$log.info(err);
					}
				);
			} else {
				$mdDialog.show({
					controller: 'confirmationController',
					templateUrl: 'views/confirmation-dialog.html',
					locals: {
						text: 'Are you sure you want to discard the changes?'
					},
					targetEvent: ev,
					clickOutsideToClose: false
				}).then(
					function (answer) {
						if(answer === 'yes') {
							$scope.editing = false;
							getRecipe();
						}
					}
				);
			}
			$scope.recipe.deleteImage = false;
		}
	};

	/**
	 * Will have the database remove the current image associated with this recipe.
	 */
	$scope.deleteImage = function () {
		$scope.recipe.deleteImage = true;
		$scope.recipe.image = null;
		$log.info($scope.recipe);
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

	$scope.tabCatcher = function (e) {
		if (e.which === 9) {
			e.preventDefault();
			var start = e.target.selectionStart;
			var end = e.target.selectionEnd;
			$scope.recipe.freetext = $scope.recipe.freetext.substring(0, start) + '\t' + $scope.recipe.freetext.substring(end);
			angular.element(e.target).val($scope.recipe.freetext);
			e.target.selectionStart = e.target.selectionEnd = start + 1;
		}
	};

	function init () {
		getRecipe();
		getComments();
		$scope.$watch('file', function () { //Makes sure any selected file is uploaded to the server.
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