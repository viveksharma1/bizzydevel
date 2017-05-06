myApp.controller('RosemateVoucherCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', '$stateParams', 'config', '$filter', 'FileUploader', 'sharedFactory', function ($scope, $http, $timeout, $rootScope, $state, $stateParams, config, $filter, FileUploader, sharedFactory) {
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        sharedFactory.info = null;
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
    $scope.purInfo.selectedCompany1 = {};
    $scope.purInfo.selectedCompany2 = {};
    $scope.purInfo.receipts = [];
    $scope.purInfo.payments = [];
    $scope.paymentDate = 'paymentDate';
    $scope.purInfo.openingBalance = 0;
    $scope.oldAttachment = null;
    var type = $stateParams.type;
    //var cashAccountWatcher;
    $('#paymentDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        setDate:new Date()
    });//.datepicker('setDate',new Date());
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
    //$('#paymentdate').datepicker().on('changeDate', function (ev) {
    //    $('.datepicker').hide();
    //});
    //$scope.paymentdate = $filter('date')(new Date(), 'dd/MM/yyyy');
    if (sharedFactory.info != null) {
        setDate($scope.paymentDate,sharedFactory.info.paymentDate);
        $scope.purInfo = sharedFactory.info;
        $scope.paymentNo = sharedFactory.info.vochNo;
        //getVoucherCount();
        clearAddPaymentBox();
        clearAddReceiptBox();

    }
    else if ($stateParams.voId) {
        //if (cashAccountWatcher) cashAccountWatcher();
        $scope.editMode = true;
        getPaymentdata($stateParams.voId);
    } else {
        setDate($scope.paymentDate);
        $scope.editMode = false;
        getVoucherCount();

        //$scope.$watch('purInfo.cashAccount.selected', function () {
        //    if ($scope.purInfo.cashAccount && $scope.purInfo.cashAccount.selected) {
        //        if (!$scope.bindingEdit) {
        //            $scope.purInfo.payments = [];
        //            $scope.purInfo.receipts = [];
        //            //$http.get(config.login + "getPaymentAccount/" + $scope.purInfo.cashAccount.selected.id).then(function (response) {
        //            //    $scope.bankAccounts = response.data
        //            //    console.log($scope.bankAccounts);
        //            //});
        //        }
        //    }
        //});
        //$scope.purInfo.selectedCompany1 = $scope.$parent.$parent.DefaultCompany;
        // $scope.purInfo.selectedCompany2 = $scope.$parent.$parent.DefaultCompany;


    }
    //initwatch();
    getAccount();
    bindCompanyList();
    bindSalesPartyAccount();
    bindPurchasePartyAccount();
    var eCashAccountId;
    function getPaymentdata(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        $scope.bindingEdit = true;
                        console.log(response);
                        $scope.paymentNo=response.data.vochNo;
                        setDate($scope.paymentDate, response.data.date);
                        eCashAccountId = response.data.vo_rosemate.bankAccountId;
                        $scope.purInfo = {
                            cashAccount: { selected: { accountName: localStorage[response.data.vo_rosemate.bankAccountId],id: response.data.vo_rosemate.bankAccountId }},
                            openingBalance: response.data.vo_rosemate.openingBalance,
                            receipts: response.data.vo_rosemate.receipts,
                            payments: response.data.vo_rosemate.payments,
                            narration: response.data.vo_rosemate.narration,
                            selectedCompany1: getCompany(response.data.compCode),
                            selectedCompany2: getCompany(response.data.compCode)
                        }
                        //$scope.narration = response.data.vo_rosemate.narration;
                        $scope.attachements = response.data.vo_rosemate.attachements;
                        bindAttachments(response.data.vo_rosemate.attachements, function () {
                            $scope.oldAttachment = null;
                        });
                        $scope.bindingEdit = false;

                    });
    }
    
    

        function bindAttachments(attachments, callback) {

        if (attachments) {
            angular.forEach(attachments, function (item) {
                $scope.oldAttachment = item;
                //var file = item;
                //file.file = { name: item.name, type: item.fileType, size: item.fileSize };
                //var files = uploader.isHTML5 ? this.element[0].files : this.element[0];
                //var options = uploader.getOptions();
                //var filters = uploader.getFilters();
                //file.file.isOld = true;
                //if (!this.uploader.isHTML5) this.destroy();
                item.file.isOld = true;
                uploader.addToQueue(item.file);
                //uploader.addToQueue(item);
            });
        }
        if (callback)
            callback();
    }
    //Bind Cash Accounts
    function getAccount () {
        $http.get(config.login + "getPaymentAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.bankAccounts = response.data
            //console.log($scope.bankAccounts);
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
            $http.get(config.api + "voucherTransactions/count" + "?[where][type]="+type).then(function (response) {
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
            //console.log($scope.partyAccounts);
        });
    }

    function bindPurchasePartyAccount() {
        $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.purPartyAccounts = response.data
            //console.log($scope.partyAccounts);
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
    $scope.selectedReceiptIndex = null;
    $scope.editReceipt = function (data, index) {
        if ($scope.selectedReceiptIndex === index) {
            $scope.selectedReceiptIndex = null;
            clearAddReceiptBox();
        } else {
            $scope.selectedReceiptIndex = index;
            $scope.purInfo.salePartyAccount = { selected: { accountName: localStorage[data.vo_payment.partyAccountId], id: data.vo_payment.partyAccountId } }
            $scope.purInfo.selectedCompany1 = getCompany(data.compCode);
            $scope.purInfo.amtSale = data.amount;
        }
    }
    $scope.selectedPaymentIndex = null;
    $scope.editPayment = function (data, index) {
        if ($scope.selectedPaymentIndex === index) {
            $scope.selectedPaymentIndex = null;
            clearAddPaymentBox();
        } else {
            $scope.selectedPaymentIndex = index;
            $scope.purInfo.purPartyAccount = { selected: { accountName: localStorage[data.vo_payment.partyAccountId], id: data.vo_payment.partyAccountId } }
            $scope.purInfo.selectedCompany2 = getCompany(data.compCode);
            $scope.purInfo.amtPurchase = data.amount;
        }
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
            type: "Receipt",
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
        if ($scope.purInfo.receipts.length == 0 && $scope.purInfo.payments.length == 0) {
            showErrorToast("Please add receipts or payments.");
            return;
        }
        var pendingUploads=uploader.getNotUploadedItems();
        if (pendingUploads.length > 0) {
            showErrorToast("Please review attachments some of them are not uploaed to server.");
            return;
        }

        var queue = uploader.queue;
        var attachements = [];
        angular.forEach(queue, function (fileItem) {
            attachements.push({ title: fileItem.title, cdnPath:fileItem.cdnPath,file:fileItem.file})
        });
            var paymentdate = getDate($scope.paymentDate);
            var data = {
                compCode: localStorage.CompanyId,
                type: type,
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
                    narration: $scope.purInfo.narration,
                    attachements:attachements
                }
            };
            $http.post(config.login + 'saveRosemate?id=' + $stateParams.voId, data)
                             .then(function (response) {
                                 sharedFactory.info = null;
                                 showSuccessToast("Rosemate Created.");
                                 $state.reload();

                             });
        
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
    
    $scope.cashAccountSelected = function () {


        //function initwatch() {
        //    $scope.$watch('purInfo.cashAccount.selected',function(){
        if ($scope.purInfo.cashAccount && $scope.purInfo.cashAccount.selected) {
            if ($scope.purInfo.cashAccount.selected.id !== eCashAccountId) {
                $scope.purInfo.payments = [];
                $scope.purInfo.receipts = [];
            }
            //$http.get(config.login + "getPaymentAccount/" + $scope.purInfo.cashAccount.selected.id).then(function (response) {
            //    $scope.bankAccounts = response.data
            //    console.log($scope.bankAccounts);
            //});


        }
        //});
        //}
    }
    $scope.downloadAttachments = function () {
        var zip = new JSZip();
        angular.forEach($scope.attachements, function (item) {
            var path = item.cdnPath.substring(item.cdnPath.lastIndexOf('/') + 1);
            var url = config.login + "getfile?path=" + path;
            var filename = item.file.name.replace(/.*\//g, "");
            zip.file(filename, urlToPromise(url), { binary: true });
        });
        zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
            var msg = "progression : " + metadata.percent.toFixed(2) + " %";
            if (metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
        })
        .then(function callback(blob) {
            // see FileSaver.js
            saveAs(blob, $stateParams.voId + ".zip");
        }, function (e) {
        });

        return false;
    };
    $scope.openReceipt = function () {
        if ($scope.purInfo.cashAccount == undefined || $scope.purInfo.cashAccount == null) {
            showErrorToast("Please Select Cash Account");
            return;
        }
        sharedFactory.info = $scope.purInfo;
        sharedFactory.info.vochNo = $scope.paymentNo;
        sharedFactory.info.paymentDate = getDate($scope.paymentDate);
        sharedFactory.info.selectedReceiptIndex = $scope.selectedReceiptIndex;
        $state.go('Customer.Receipt',null, {location:false});
        //var url = $state.href('Customer.Receipt', { voId: "1" });
        //window.open(url, '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //window.open(url, '_blank');
    }
    $scope.openPayment = function () {
        if ($scope.purInfo.cashAccount == undefined || $scope.purInfo.cashAccount == null) {
            showErrorToast("Please Select Cash Account");
            return;
        }
        sharedFactory.info = $scope.purInfo;
        sharedFactory.info.vochNo = $scope.paymentNo;
        sharedFactory.info.paymentDate = getDate($scope.paymentDate);
        sharedFactory.info.selectedPaymentIndex = $scope.selectedPaymentIndex;
        $state.go('Customer.Payment', null, { location: false });
        //var url = $state.href('Customer.Receipt', { voId: "1" });
        //window.open(url, '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //window.open(url, '_blank');
    }
    //$timeout(initwatch, 2000);
    //;
}]);