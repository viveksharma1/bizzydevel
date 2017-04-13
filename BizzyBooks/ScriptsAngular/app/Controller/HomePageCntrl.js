myApp.controller('HomePageCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.namechange = function () {
        $('#namechangeModal').modal('show');
    }

    $('#Fromdate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#Todate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    ;}]);