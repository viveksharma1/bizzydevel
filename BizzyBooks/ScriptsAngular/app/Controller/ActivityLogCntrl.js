myApp.controller('ActivityLogCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

    $('#DateFilter').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    ;
}]);