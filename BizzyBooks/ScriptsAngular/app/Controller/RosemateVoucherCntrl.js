myApp.controller('RosemateVoucherCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', '$stateParams', 'config', '$filter', 'FileUploader', function ($scope, $http, $timeout, $rootScope, $state, $stateParams, config, $filter,FileUploader){
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },

    //$('.filenameDiv').hide();
    //$('.attechmentDescription').hide();
    //$('.Attechmentdetail').click(function () {
    //    $('.filenameDiv').show();
    //    $("#name").append($("#NameInput").val());
    //    $("#type").append($("#uploadBtn").val());

    //});

    //$('#removeattachment').click(function () {
    //    $('.filenameDiv').hide();
    //});

    $(":file").filestyle({ buttonName: "btn-sm btn-info" });
    $scope.purInfo = {};
    $scope.purInfo.receipts = [];
    $scope.purInfo.payments = [];
    $scope.paymentDate = 'paymentDate';
    $scope.purInfo.openingBalance = 0;
    $('#paymentDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        setDate:new Date()
    });//.datepicker('setDate',new Date());
    
    //$('#paymentdate').datepicker().on('changeDate', function (ev) {
    //    $('.datepicker').hide();
    //});
    //$scope.paymentdate = $filter('date')(new Date(), 'dd/MM/yyyy');
    
    if ($stateParams.voId) {
        $scope.editMode = true;
        getPaymentdata($stateParams.voId);
    } else {
        setDate($scope.paymentDate);
        $scope.editMode = false;
        getAccount();
        bindCompanyList();
        getVoucherCount();
        bindSalesPartyAccount();
        bindPurchasePartyAccount();
        $scope.$watch('purInfo.cashAccount.selected', function () {
            if ($scope.purInfo.cashAccount && $scope.purInfo.cashAccount.selected) {
                if (!$scope.bindingEdit) {
                    $scope.purInfo.payments = [];
                    $scope.purInfo.receipts = [];
                    //$http.get(config.login + "getPaymentAccount/" + $scope.purInfo.cashAccount.selected.id).then(function (response) {
                    //    $scope.bankAccounts = response.data
                    //    console.log($scope.bankAccounts);
                    //});
                }
            }
        });
        //$scope.selectedCompany1 = $scope.$parent.$parent.DefaultCompany;
       // $scope.selectedCompany2 = $scope.$parent.$parent.DefaultCompany;


    }
    function getPaymentdata(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        $scope.bindingEdit = true;
                        console.log(response);
                        $scope.paymentNo=response.data.vochNo;
                        setDate($scope.paymentDate, response.data.date);
                        $scope.purInfo = {
                            cashAccount: { selected: { accountName: localStorage[response.data.vo_rosemate.bankAccountId],id: response.data.vo_rosemate.bankAccountId }},
                            openingBalance: response.data.vo_rosemate.openingBalance,
                            receipts: response.data.vo_rosemate.receipts,
                            payments: response.data.vo_rosemate.payments,
                            narration: response.data.vo_rosemate.narration
                        }
                        $scope.bindingEdit = false;

                    });
    }
    
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
        //$scope.getSupplier();
    }
    $scope.Accountbtn = function (id, type) {
        if (type) {
            console.log(id);
            $('#formaccount').modal('show');
            if (id != undefined) {
                $http.get(config.api + "accounts/" + id).then(function (response) {
                    console.log(response);
                    $scope.myValue = response.data;
                    $scope.isAccount = false
                });
            }
            else {
                $scope.myValue = null;
            }
        }
    };

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
            $scope.purInfo.selectedCompany1 = getCompany(localStorage.CompanyId);
            $scope.purInfo.selectedCompany2 = getCompany(localStorage.CompanyId);
            //$scope.purInfo.selectedCompany1 = JSON.parse(localStorage.DefaultCompany);

            //$scope.purInfo.selectedCompany2 = localStorage.CompanyId;
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
    function getCompany(Id){
        for(var i=0;i<$scope.CompanyList.length;i++){
            if($scope.CompanyList[i].CompanyId===Id)
                return $scope.CompanyList[i];//.CompanyName;
            
        }
    }
    $scope.receiptTotal = 0;
    $scope.paymentTotal = 0;
    $scope.getReceiptTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.purInfo.receipts.length; i++) {
            var item = $scope.purInfo.receipts[i];
            total += item.amount;
        }
        $scope.receiptTotal = total;
        return total;
    }
    $scope.getPayementTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.purInfo.payments.length; i++) {
            var item = $scope.purInfo.payments[i];
            total += item.amount;
        }
        $scope.paymentTotal = total;
        return total;
    }
    
    $scope.getClosingBalance=function() {
        return $scope.purInfo.openingBalance+ $scope.receiptTotal- $scope.paymentTotal;
        
    }
    $scope.removePayment = function (index) {
        $scope.purInfo.payments.splice(index, 1);
    }
    $scope.removeReceipt = function (index) {
        $scope.purInfo.receipts.splice(index, 1);
    }
    function clearAddPaymentBox() {
        //$scope.purInfo.selectedCompany2 = {};
        $scope.purInfo.purPartyAccount = {};
        $scope.purInfo.amtPurchase = null;
    }
    function clearAddReceiptBox() {
        //$scope.purInfo.selectedCompany1 = {};
        $scope.purInfo.salePartyAccount = {};
        $scope.purInfo.amtSale = null;
    }
    $scope.addPayment = function () {
        //validate
        if ($scope.purInfo.cashAccount == undefined || $scope.purInfo.cashAccount == null) {
            showErrorToast("Please Select Cash Account");
            return;
        }
        if ($scope.purInfo.selectedCompany2 == undefined || $scope.purInfo.selectedCompany2 == null) {
            showErrorToast("Please Select Company");
            return;
        }
        if ($scope.purInfo.purPartyAccount.selected == undefined || $scope.purInfo.purPartyAccount.selected == null) {
            showErrorToast("Please Select Account");
            return;
        }
        if ($scope.purInfo.amtPurchase == undefined || $scope.purInfo.amtPurchase == null) {
            showErrorToast("Please Enter Amount");
            return;
        }
        var paymentdate = getDate($scope.paymentDate);
        var data = {
            compCode: localStorage.CompanyId,
            type: "Payment",
            role: localStorage['usertype'],
            date: paymentdate,
            amount: $scope.purInfo.amtPurchase,
            state: "PAID",
            vo_payment: {
                companyName:$scope.purInfo.selectedCompany2.CompanyName,
                bankAccountId: $scope.purInfo.cashAccount.selected.id,
                partyAccountId: $scope.purInfo.purPartyAccount.selected.id,
                partyAccountName: $scope.purInfo.purPartyAccount.selected.accountName,
                paymentAmount: $scope.purInfo.amtPurchase,
                billDetail: []
            },
        }
        $scope.purInfo.payments.push(data);
        clearAddPaymentBox();

    }
    
    $scope.addReceipt = function () {
        //validate
        if ($scope.purInfo.cashAccount == undefined || $scope.purInfo.cashAccount == null) {
            showErrorToast("Please Select Cash Account");
            return;
        }
        if ($scope.purInfo.selectedCompany1 == undefined || $scope.purInfo.selectedCompany1 == null) {
            showErrorToast("Please Select Company");
            return;
        }
        if ($scope.purInfo.salePartyAccount.selected == undefined || $scope.purInfo.salePartyAccount.selected == null) {
            showErrorToast("Please Select Account");
            return;
        }
        if ($scope.purInfo.amtSale == undefined || $scope.purInfo.amtSale == null) {
            showErrorToast("Please Enter Amount");
            return;
        }
        var paymentdate = getDate($scope.paymentDate);
        var data = {
            compCode: localStorage.CompanyId,
            type: "Receive Payment",
            role: localStorage['usertype'],
            date: paymentdate,
            amount: $scope.purInfo.amtSale,
            state: "PAID",
            vo_payment: {
                companyName: $scope.purInfo.selectedCompany1.CompanyName,
                bankAccountId: $scope.purInfo.cashAccount.selected.id,
                partyAccountId: $scope.purInfo.salePartyAccount.selected.id,
                partyAccountName: $scope.purInfo.salePartyAccount.selected.accountName,
                paymentAmount: $scope.purInfo.amtSale,
                balanceAmtReceipt: 0,
                billDetail:[]
            }
        };
        $scope.purInfo.receipts.push(data);
        clearAddReceiptBox();


    }
    $scope.saveRosemate = function () {
        if ($scope.purInfo.receipts.length > 0) {
            var paymentdate = getDate($scope.paymentDate);
            var data = {
                compCode: localStorage.CompanyId,
                type: "Rosemate",
                role: localStorage['usertype'],
                date: paymentdate,
                vochNo: $scope.paymentNo,
                state: "PAID",
                remark: $scope.purInfo.narration,
                vo_rosemate: {
                    bankAccountId: $scope.purInfo.cashAccount.selected.id,
                    receipts: $scope.purInfo.receipts,
                    payments: $scope.purInfo.payments,
                    openingBalance: $scope.purInfo.openingBalance,
                    narration:$scope.purInfo.narration
                }
            };
            $http.post(config.login + 'saveRosemate?id=' + $stateParams.voId, data)
                             .then(function (response) {
                                 showSuccessToast("Rosemate Created.");
                                 $state.reload();

                             });
        }
    }

    //File Upload code
    var uploader = $scope.uploader = new FileUploader({
        url: config.login + "upload"
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onAfterAddingFile = function (fileItem) {
        if (fileItem.isOld && $scope.oldAttachment) {
            fileItem.title = $scope.oldAttachment.title;
            fileItem.cdnPath = $scope.oldAttachment.cdnPath;
        } else {
            console.info('onAfterAddingFile', fileItem);
            if ($scope.filename) {
                fileItem.title = $scope.filename;
                $scope.filename = null;
            } else {
                uploader.removeFromQueue(fileItem);// = null;
                fileItem = {};
            }
        }

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        fileItem.cdnPath = response.name;
    };
    

}]);