'use strict';

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout, $location, $mdDialog) {
	$scope.searchTerm = "";
	$scope.user = '';
	$scope.usernames = [];

	$scope.search = function (searchTerm) {
		$location.url('/search?search=' + searchTerm);
		$scope.searchTerm = "";
	};

	function authenticateUser (name, password) {
		$http.post('/api/login', {name: name, password: password}).then(
			function (res) {
				if(res.data.success) {
					$scope.user = res.data.name;
				} else {
					$log.info("Failed to autenticate.");
					$scope.logout();
				}
			}, function (err) {
				$log.info(err);
			}
		);
	}

	$scope.newRecipe = function (ev) {
		$mdDialog.show({
			controller: 'newRecipeController',
			templateUrl: 'views/new-recipe.html',
			targetEvent: ev,
			clickOutsideToClose: false
		}).then(
			function (form) {
				if(form.action === 'done') {
					$http.post('/api/new-recipe', {name: form.name, username: $scope.user}).then(
						function (res) {
							$location.url('/recipe?id='+res.data.id);
						}, function (err) {
							$log.info(err);
						}
					);
				}
			}
		);
	};

	$scope.logout = function (ev) {
		$scope.user = '';
		$mdDialog.show({
			controller: 'loginController',
			templateUrl: 'views/login.html',
			targetEvent: ev,
			clickOutsideToClose: false
		}).then(
			function (form) {
				if(form.password === undefined) { //Empty passwords are allowed, but angular might make the field undefined if not filled in.
					form.password = '';
				}
				authenticateUser(form.name, form.password);
			}
		);
	};

	function getUsernames () {
		$http.get('/api/usernames').then(
			function (res) {
				$scope.usernames = res.data;
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init () {
		authenticateUser('Guest', '');
		getUsernames();
	}

	$timeout(init());
});