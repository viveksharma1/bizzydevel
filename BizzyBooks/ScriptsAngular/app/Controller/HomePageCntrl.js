myApp.controller('HomePageCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.namechange = function () {
        $('#namechangeModal').modal('show');
    }

    $('#fdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#tdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

}]);
