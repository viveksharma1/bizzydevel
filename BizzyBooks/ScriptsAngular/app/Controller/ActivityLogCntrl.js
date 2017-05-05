myApp.controller('ActivityLogCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $rootScope, $state, config) {

    $('#DateFilter').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    

    $scope.userActivityLog = [];
    $http.get(config.api + "userActivities").then(function (response) {
        if (response.data.length>0) {
            $scope.userActivityLog = response.data
        }
        else {
            showSuccessToast("some internal problem");
        }
    });

}]);