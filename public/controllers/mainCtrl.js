angular.module('mainCtrl', ['zingchart-angularjs'])

    .controller('mainController', function ($scope, $rootScope, $interval) {

        var vm = this;

        $scope.myData = [4, 5, 7, 11, 0];

        $scope.name ='Marcelo';
        
        $rootScope.horario = new Date().toLocaleTimeString();

        $interval(function () {
            $rootScope.horario = new Date().toLocaleTimeString();
        }, 1000);



    });


