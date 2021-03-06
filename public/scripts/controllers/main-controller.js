'use strict';

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout, $location, $mdDialog) {
	$scope.searchTerm = "";
	$scope.user = '';
	$scope.usernames = [];

	/**
	 * Sets the url to reflect the search and loads the search controller.
	 */
	$scope.search = function (searchTerm) {
		$location.url('/search?search=' + searchTerm);
		$scope.searchTerm = "";
	};

	/**
	 * Performs a login attempt over http using the provided credentials.
	 */
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

	/**
	 * Displays a form for creating recipes.
	 * Upon form completetion, a creation request is sent over http.
	 */
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
							if(res.data.success) {
								$location.url('/recipe?id='+res.data.id);
							}
						}, function (err) {
							$log.info(err);
						}
					);
				}
			}
		);
	};

	/**
	 * Clears the current user's credentials and displays the login form.
	 */
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