angular.module('app.routes', ['ngRoute'])

	.config(function($routeProvider, $locationProvider) {

		$routeProvider

		// route for the home page
			.when('/', {
				templateUrl : 'views/pages/home.html'
			})
			// login page
			.when('/login', {
				templateUrl: 'views/pages/iot/casa.html',
				controller: 'mqttController',
				controllerAs: 'mqtt'
			})

			.when('/iot', {
				templateUrl: 'views/pages/iot/casa.html',
				controller: 'mqttController',
				controllerAs: 'mqtt'

			})

			.otherwise({
				templateUrl: 'views/pages/error/error.html'
			});

		$locationProvider.html5Mode(true);

	});
