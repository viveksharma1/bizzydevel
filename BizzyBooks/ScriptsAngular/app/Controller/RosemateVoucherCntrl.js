myApp.controller('RosemateVoucherCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', '$stateParams', 'config', '$filter', 'FileUploader', function ($scope, $http, $timeout, $rootScope, $state, $stateParams, config, $filter,FileUploader){
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },

    $('.filenameDiv').hide();
    $('.attechmentDescription').hide();
    $('.Attechmentdetail').click(function () {
        $('.filenameDiv').show();
        $("#name").append($("#NameInput").val());
        $("#type").append($("#uploadBtn").val());

    });

    $('#removeattachment').click(function () {
        $('.filenameDiv').hide();
    });

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });


    $('#Date').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    if ($stateParams.voId) {
        $scope.editMode = true;
        //getPaymentdata($stateParams.voId);
    } else {
        $scope.editMode = false;
        getAccount();
        bindCompanyList();
        getVoucherCount();
        bindSalesPartyAccount();
        bindPurchasePartyAccount();
    }


    //Bind Cash Accounts
    function getAccount () {
        $http.get(config.login + "getPaymentAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.bankAccounts = response.data
            console.log($scope.bankAccounts);
        });
    }

    //Bind Company
    function bindCompanyList() {
        if (localStorage.comobj != undefined) {
            $scope.CompanyList = JSON.parse(localStorage.comobj);
        }
    }

    //Bind Voucher No
    function getVoucherCount(callback) {
        if ($scope.editMode) {
            if (callback) callback();
        } else {
            $http.get(config.api + "voucherTransactions/count" + "?[whrer][type]= Receive Payment").then(function (response) {
                $scope.paymentNo = response.data.count + 1;
                console.log(response);
                if (callback) callback();
            });
        }
    }
    //Bind Accounts
    function bindSalesPartyAccount() {
        $http.get(config.login + "getPartytAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.salepartyAccounts = response.data
            console.log($scope.partyAccounts);
        });
    }

    function bindPurchasePartyAccount() {
        $http.get(config.login + "getPartytAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.purPartyAccounts = response.data
            console.log($scope.partyAccounts);
        });
    }





}]);