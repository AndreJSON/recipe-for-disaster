'use strict';

angular.module('app').controller('confirmationController', function ($scope, $mdDialog, text) {
	
	$scope.text = text;

	$scope.closeWithValue = function (value) {
		$mdDialog.hide(value);
	};
});