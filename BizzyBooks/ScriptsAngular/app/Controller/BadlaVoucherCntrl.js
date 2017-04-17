myApp.controller('BadlaVoucherCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }

    $('#BadlaDate').datepicker();
    //$('#interestDate').datepicker();

    function getVoucherInfo(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        console.log(response);

                        $scope.voucherData = response.data;
                        $scope.state = response.data.state;
                        $scope.billInfo = response.data.vo_badla.billDetail[0];
                        $scope.amount = response.data.amount
                        $scope.paymentNo = response.data.vochNo
                        
                        $scope.badlaAccount = localStorage[response.data.vo_badla.badlaAccountId];//, id: response.data.vo_badla.badlaAccountId } };

                        $scope.badlaDate = $filter('date')(response.data.date, 'dd/MM/yyyy');
                        $scope.dueDate = $filter('date')($scope.billInfo.duedate, 'dd/MM/yyyy');
                        $scope.invoiceDate = $filter('date')($scope.billInfo.date, 'dd/MM/yyyy');
                        //console.log(response.data.vo_payment.bankAccount);
                        //$scope.partyAccount = { selected: { accountName: localStorage[response.data.vo_payment.partyAccountId], id: response.data.vo_payment.partyAccountId } };

                        //$scope.paymentdate = $filter('date')(response.data.date, 'dd/MM/yyyy');
                        //fill badla info if exists

                        var badlaInfo = response.data.vo_badla;
                        if (badlaInfo) {
                            //$scope.chkBadla = true;
                            //$scope.badlaDate = $filter('date')(badlaInfo.data, 'dd/MM/yyyy');
                            //$scope.badlaAccount = { selected: { id: badlaInfo.partyAccountId } };
                            //$scope.badlaAmount = badlaInfo.amount;
                            $scope.dayTotal = badlaInfo.conditons.dayTotal;
                            $scope.dayInterest = badlaInfo.conditons.dayInterest;
                            $scope.dayDiff = badlaInfo.conditons.dayDiff;
                            $scope.perTotal = badlaInfo.conditons.perTotal;
                            $scope.perInterest = badlaInfo.conditons.perInterest;
                            $scope.perDiff = badlaInfo.conditons.perDiff;
                        }


                    });
    }

    if ($stateParams.voId) {
        getVoucherInfo($stateParams.voId);
    }


}]);