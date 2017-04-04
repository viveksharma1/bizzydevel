myApp.controller('TaxInvoicePDFCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function () {
        window.history.back();
    }
}]);