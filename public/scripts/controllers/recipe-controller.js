'use strict';

angular.module('app').controller('recipeController', function ($scope, $log, $http, $timeout) {
	$scope.user = $scope.$parent.user;
	$scope.usernames = $scope.$parent.usernames;
	$scope.recipe = {};
});