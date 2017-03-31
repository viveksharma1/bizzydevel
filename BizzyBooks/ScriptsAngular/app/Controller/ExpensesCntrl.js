myApp.controller('ExpensesCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {
    $(".my a").click(function (e) {
        e.preventDefault();
    })


    $scope.groups = $scope.model.$selected;
    
 //test
}]);