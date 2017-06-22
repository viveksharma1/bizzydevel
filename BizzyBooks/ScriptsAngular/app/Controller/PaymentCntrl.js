myApp.controller('PaymentCntrl', ['$scope', '$http', '$stateParams', '$timeout', 'commonService', '$rootScope', '$state', 'config', '$filter', 'FileUploader', 'sharedFactory', 'commonService', 'authService', function ($scope, $http, $stateParams, $timeout, commonService, $rootScope, $state, config, $filter, FileUploader, sharedFactory, commonService, authService) {

    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    //localStorage["type1"] = "PAYMENT"
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.clear = function ($event, $select) { ///ui select clear.
       // $event.stopPropagation();
        //to allow empty field, in order to force a selection remove the following line
        $select.selected = null;
        //reset search query
        $select.search = undefined;
        //focus and open dropdown
        $timeout(function () {
            $select.activate();
        }, 200);
    }
    //$scope.goBack = function (retain) {
    //    if ($rootScope.$previousState.name.length == 0 || $rootScope.$previousState == $state.current || $stateParams.noBackTrack) {
    //        window.history.back();
    //    } else
    //        $state.go($rootScope.$previousState);
    //}

    $scope.goBack = function () {
        window.history.back();
    }
    $(":file").filestyle({ buttonName: "btn-sm btn-info" });
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
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
    }

    $('#paymentdate').datepicker({
        assumeNearbyYear: true,
        todayBtn: true

    });
    
  //  var date = localStorage.paymentDate
   // var pDate = new Date(date).
    //setDate($scope.paymentdate, pDate.toISOString());
    $scope.paymentdate = "paymentdate";
    if ($stateParams.pDate != null) {
        setDate($scope.paymentdate, $stateParams.pDate);
    }
    else {
       $scope.paymentdate = "paymentdate"
    }
   
    var type = $stateParams.type;
    $scope.bankAccount = {};
    $scope.partyAccount = {};
    if (localStorage.bankAccountId) {
        $scope.bankAccount = { selected: { accountName: localStorage[localStorage.bankAccountId], id: localStorage.bankAccountId } };
        getBankAccountBalance(localStorage.bankAccountId)
    }
    else {
        $scope.bankAccount = {}
    }
    if ($stateParams.partyAccountId != null) {
        $scope.partyAccount = { selected: { accountName: localStorage[$stateParams.partyAccountId], id: $stateParams.partyAccountId } };
        getAllBill($stateParams.partyAccountId);
        
        //setDate($scope.paymentdate, localStorage.paymentDate);
       
    }
    else {
        $scope.partyAccount = {};
    }
    // $scope.paymentdate = 'paymentdate';
    //setDate($scope.paymentdate, localStorage.paymentDate.toISOString());
    ////$scope.paymentdate = localStorage.paymentDate.toISOString();
   
    $scope.paymentData = [];
    $scope.transaction = [];
    $scope.paidData = [];
    $scope.itemChecked = [];
    $scope.accountTable = []
    $scope.custom = false
    $scope.forex = {}
   
    $scope.oldAttachment = null;
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

    uploader.onAfterAddingFile = function (fileItem) {
        if (fileItem.isOld && $scope.oldAttachment) {
            fileItem.title = $scope.oldAttachment.title;
            fileItem.cdnPath = $scope.oldAttachment.cdnPath;
            //fileItem_onSuccess();
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
        fileItem.cdnPath = //response.container + "/" +
            response.name;
    };
    
    function getAccounts() {
        $scope.getSupplier = function () {
            $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
                $scope.partyAccounts = response.data
            });
        }
        $scope.getAccount = function () {
            $http.get(config.login + "getPaymentAccount/" + localStorage.CompanyId).then(function (response) {
                $scope.bankAccounts = response.data
            });
        }
    }
    getAccounts();
    $("#dollaramount").hide()
    $("#dollarbalance").hide()
    $("#forex").hide()
    $scope.currency1 = function (currency) {
        if (currency == 'Rupee') {
            $("#dollaramount").hide()
            $("#dollarbalance").hide()
            $("#forex").hide()

        }
        if (currency == 'Dollar') {
            $("#dollaramount").show()
            $("#dollarbalance").show()
            $("#forex").show()
        }
        resetToInitial();
       
        //if (currency == "Rupee") {
        //    $scope.subtotalnew = $scope.ExchangeRateINR * $scope.subtotalnew1;
        //    $scope.subtotal = $filter('currency')($scope.subtotalnew, '₹', 2);
        //}
        //if (currency == "Dollar") {
        //    $scope.subtotalnew = Math.round($scope.subtotalnew1);
        //    $scope.subtotal = $filter('currency')($scope.subtotalnew, '$', 2)
        //}
    }
    $scope.exchangeRate = function () {
        var access_key = 'af072eeb3d8671688ff6eaa83c8dbcb8';
        var url = 'http://apilayer.net/api/live?access_key=' + access_key;
        $http.get(url).then(function (response) {
            $scope.ExchangeRate = response.data.quotes.USDINR.toFixed(2);
            $scope.ExchangeRateINR = Number($scope.ExchangeRate)
        });

    }
    $scope.calculateForexLossAndGain = function () {
        var data = $scope.itemChecked
        var forex =  []
        var forexAmount = 0
        
        for (var i = 0; i < data.length; i++) {
     
            forexAmount += (Number(data[i].exchangeRate) - Number($scope.ExchangeRateINR)) * data[i].amountPaidInDollar
        }
                      
    
       if (forexAmount>0) {
           $scope.forexAmount = Number(forexAmount)
        $scope.totalforexLoss = 0
        $scope.credit = false
      } else {   
        $scope.forexAmount = Number(forexAmount)
        $scope.totalforexGain = 0
        $scope.credit = true
      }
   }
      
    $scope.forexAmount = 0
    "get open invoice"
    $scope.getOpenInvoice = function (data,id) {
        if ($scope.partyAccount.selected && $scope.partyAccount.selected.id) {
            getAllBill($scope.partyAccount.selected.id);
        }
        $scope.salesAccountType = data.balanceType == 'debit' ? " (Dr.) " : " (Cr.)";
       // var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(id).then(function (response) {
            if (response.data) {
                $scope.salesAccountBalance = response.data.balance
            } else {
                $scope.salesAccountBalance = 0.00;
            }
        });
    }
    if (sharedFactory.info != null) {
        $scope.mode = "return";
        if(!$stateParams.pDate)
         setDate($scope.paymentdate);
        $scope.currency = "Dollar";
        $scope.exchangeRate();
        fillRosemateData();
    }
    else if ($stateParams.voId) {
        $scope.mode = "edit";
        getPaymentdata($stateParams.voId);
    } else {
       
        $scope.mode = "new";
        if (!$stateParams.pDate)
         setDate($scope.paymentdate);
        $scope.currency = "Rupee";
        $scope.exchangeRate();
        
    }
    $scope.getAccount();
    $scope.getSupplier();

    if ($scope.mode != "edit") getVoucherCount();

    $scope.paidAmountChanged= function () {
        resetToInitial();
    };
   
    function getVoucherCount() {
        if (authService.userHasPermission('usertype:O')) {
            var isUo1 = false
        } else {
            var isUo1 = true
        }
        //$http.get(config.api + "voucherTransactions/count" + "?[where][type]=" + type +"&[where][compCode]=" + localStorage.CompanyId).then(function (response) {
        //    $scope.paymentNo = response.data.count + 1
        //});
        $http.get(config.login + "voucherTransactions/count" + "?type=" + type + "&compCode=" + localStorage.CompanyId + "&isUo=" + isUo1).then(function (response) {
            $scope.paymentNo = response.data.count + 1
        });
    }
    function resetToInitial() {
        if ($scope.itemChecked.length > 0) {
            $scope.itemChecked = [];
            angular.copy($scope.paidData, $scope.paymentData);
        }
        $scope.balanceAmtReceipt = $scope.totalPaidAmount;
        $scope.balanceAmtDollar = $scope.totalDollarAmount
        calculateTotal(false);
    }
    function getBalanceAmtReceipt(amount) {
        if ($scope.totalPaidAmount && $scope.totalPaidAmount > 0) {
            var nextBal = Number( ($scope.balanceAmtReceipt - Number(amount)).toFixed(2));
            if (nextBal >= 0) {
                $scope.balanceAmtReceipt = nextBal;
            } else {
                amount = $scope.balanceAmtReceipt;
                $scope.balanceAmtReceipt = 0;
            }
        }

        return amount? Number(amount.toFixed(2)):amount;
    }

    function getBalanceAmtDollar(amount) {
        if ($scope.totalDollarAmount && $scope.totalDollarAmount > 0) {
            var nextBal = Number(($scope.balanceAmtDollar - Number(amount)).toFixed(2));
            if (nextBal >= 0) {
                $scope.balanceAmtDollar = nextBal;
            } else {
                amount = $scope.balanceAmtDollar;
                $scope.balanceAmtDollar = 0;
            }
        }

        return amount? Number(amount.toFixed(2)):amount;

    }
    function addBalanceAmtReceipt(amount) {
        if ($scope.totalPaidAmount && $scope.totalPaidAmount > 0) {
            $scope.balanceAmtReceipt = $scope.balanceAmtReceipt + amount;
        }

    }
    $scope.amountChangeInDollar = function (index, amount, rate) {
        var balanceInDollar = $scope.paymentData[index].balanceInDollar;
        $scope.paymentData[index].amountPaid = Number((Number(amount) * Number(rate)).tofixed(2))
       // $scope.paymentData[index].balanceInDollar = $scope.paymentData[index].balanceInDollar - Number(amount)

    }
    $scope.dollarAmount = function (amount) {
        $scope.totalPaidAmount = Number((Number(amount) * Number($scope.ExchangeRateINR)).toFixed(2))
        $scope.paidAmountChanged()

    }
    $scope.amountChange = function (item, payAmount, oldPayAmount) {
        if (payAmount != null)
            $scope.selectLineItem(item, true, payAmount, oldPayAmount);
        if ($scope.itemChecked.length > 0) {
            for (var i = 0; i < $scope.itemChecked.length; i++) {
                if (item) {
                    if ($scope.itemChecked[i].id == item.id) {
                        if ($scope.itemChecked[i].old)
                            $scope.itemChecked[i].balance += Number(oldPayAmount) - Number(payAmount);
                        if ($scope.itemChecked[i].balance - payAmount >= 0) {
                            payAmount = getBalanceAmtReceipt(payAmount);
                            $scope.itemChecked[i].amountPaid = payAmount;
                            item.balance = $scope.itemChecked[i].balance;
                            item.amountPaid = payAmount;
                        } else {
                            if (oldPayAmount && oldPayAmount.length > 0) {
                                var payAmount = getBalanceAmtReceipt(item.balance);
                                item.amountPaid = payAmount;
                                $scope.itemChecked[i].amountPaid = payAmount;
                                item.balance = $scope.itemChecked[i].balance;
                                
                            }

                        }
                        break;
                    }
                }
            }
        }
        if (payAmount == null) {
            $scope.selectLineItem(item, true, payAmount, oldPayAmount);
            item.old = false;
        }
        calculateTotal(false);
    };
    function paymentDateChange() {
        angular.forEach($scope.paymentData, function (item) {
            if (Number(item.amountPaid) > 0)
                $scope.amountChange(item, item.amountPaid);
        })

    }


    $scope.selectLineItem = function (itemData, force, payAmount, oldPayAmount) {
        if (!($scope.totalPaidAmount && $scope.totalPaidAmount > 0)) {
            showErrorToast("Please enter paid amount.");
            itemData.select = false;
            return
        }
        if (itemData) {
            //if (!((itemData.invoiceType == "Domestic" && $scope.currency == "Rupee") || (itemData.invoiceType == "Import" && $scope.currency == "Dollar"))) {
            //    showErrorToast("Please select correct type of bill.");
            //    itemData.select = false;
            //    return;
            //}
            
            var item = {};
            if (itemData.select && !force) {
                itemData.amountPaid = getBalanceAmtReceipt(itemData.balance);
                itemData.amountPaidInDollar = getBalanceAmtDollar(itemData.balanceInDollar);
                angular.copy(itemData, item);
                $scope.itemChecked.push(item);
                console.log($scope.itemChecked);
            } else {
                for (var i = 0; i < $scope.itemChecked.length; i++) {
                    if ($scope.itemChecked[i].id == itemData.id) {
                        $scope.balanceAmtReceipt += oldPayAmount ? Number(oldPayAmount) : payAmount ? Number(payAmount) : Number($scope.itemChecked[i].amountPaid);
                        //$scope.balanceAmtReceipt = $scope.balanceAmtReceipt + Number($scope.itemChecked[i].amountPaid);
                        itemData.select = false;
                        if (itemData.old && !force) {
                            itemData.balance += Number($scope.itemChecked[i].amountPaid);
                            itemData.old = false;
                        }
                        if (!force) {
                            itemData.amountPaid = 0;
                        }
                        $scope.itemChecked.splice(i, 1);

                    }
                }
                if (force && Number(itemData.amountPaid) > 0) {
                    itemData.select = true;
                    angular.copy(itemData, item);
                    $scope.itemChecked.push(item);
                }
            }

            //} else {
            //    showErrorToast("Please enter paid amount.");
            //    itemData.select = false;
            //}
            calculateTotal(false);
        }

    }
    function calculateTotal(last) {
        //$scope.totalInvoiceAmount = 0;
        var total = 0;
        if ($scope.itemChecked.length > 0) {
            angular.forEach($scope.itemChecked, function (item) {
                total += item.amountPaid;
                if (last && !item.old) {
                    item.balance = item.balance - item.amountPaid >= 0 ? item.balance - item.amountPaid : 0;
                    item.balanceInDollar = item.balanceInDollar - item.amountPaidInDollar >= 0 ? item.balanceInDollar - item.amountPaidInDollar : 0;
                    item.old = true;
                }

            });
        } else {
            total = 0;
        }
        $scope.totalInvoiceAmount = Number(total.toFixed(2));

    }
    function getAllBill(supliersId, fields) {
        if (supliersId){
            $http.get(config.login + "getVouchersforPayment?customerId=" + supliersId + "&role=" + localStorage.usertype + "&compCode=" + localStorage.CompanyId).then(function (response) {
                if (response) {
                    $scope.paymentData = response.data
                    //angular.copy($scope.paymentData, $scope.paidData);
                    //checkPaymentBills();
                }
                else {
                    $scope.paymentData = [];
                    angular.copy($scope.paymentData, $scope.paidData);
                    showSuccessToast("No Open Invoice");
                }
                checkPaymentBills();
            });
        }
    }
    $scope.forex = { selected: { id: null } };
    $scope.getAllBillForCustomPayment = function () {
        $scope.custom = true;
        $http.get(config.login + "getVouchersforCustomPayment" + "?role=" + localStorage.usertype + "&compCode=" + localStorage.CompanyId ).then(function (response) {
                if (response) {
                    $scope.paymentData = response.data
                    //angular.copy($scope.paymentData, $scope.paidData);
                    //checkPaymentBills();
                }
                else {
                    $scope.paymentData = [];
                    angular.copy($scope.paymentData, $scope.paidData);
                    showSuccessToast("No Open Invoice");
                }
                checkPaymentBills();
            });
        
    }
    function checkPaymentBills() {
        removeDuplicate();
        Array.prototype.push.apply($scope.paymentData, $scope.itemChecked);
        angular.copy($scope.paymentData, $scope.paidData);
    }
    function removeReceiptById(id) {
        for (var i = 0; i < $scope.paymentData.length; i++) {
            if ($scope.paymentData[i].id == id) {
                $scope.paymentData.splice(i, 1);
                return;
            }
        }
    }
    function removeDuplicate() {
        for (var i = 0; i < $scope.itemChecked.length; i++) {
            removeReceiptById($scope.itemChecked[i].id);
            //$scope.itemChecked[i].isOld = true;
        }
    }
    $scope.deletePayment = function () {
        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role: localStorage['usertype']
        }
        $http.post(config.login + 'deletePayment?id=' + $stateParams.voId, data)
                            .then(function (response) {
                                if (response.data.err) {
                                    $rootScope.$broadcast('event:error', { message: "Error while deleting: " + response.data.err });
                                } else {
                                    showSuccessToast("Payment deleted.");
                                    $scope.goBack();// $state.reload();
                                }

                            });
    }
    $scope.visible = true
    $scope.savePayment = function (reload) {
        var paymentDate = getDate($scope.paymentdate);
        if (!paymentDate) {
            $rootScope.$broadcast('event:error', { message: "Payment date is not valid" });
            return;
        }
        if ($scope.partyAccount.selected == undefined || $scope.partyAccount.selected == null) {
            showErrorToast("Please select party account");
            return;

        }
        if ($scope.bankAccount.selected == undefined || $scope.bankAccount.selected == null) {
            showErrorToast("Please select bank/cash account");
           
            return;
        }
        if (!$scope.paymentdate) {
            showErrorToast("Please select receipt date");
            return;
        }
        var pendingUploads = uploader.getNotUploadedItems();
        if (pendingUploads.length > 0) {
            showErrorToast("Please review attachments some of them are not uploaed to server.");
            return;
        }

        var queue = uploader.queue;
        var attachements = [];
        angular.forEach(queue, function (fileItem) {
            attachements.push({ title: fileItem.title, cdnPath: fileItem.cdnPath, file: fileItem.file })
        });
        if ($scope.accountTable.length > 0) {
            $scope.totalBankAmount = $scope.totalPaidAmount + accountTableSum();
        }
        else {
            $scope.totalBankAmount = $scope.totalPaidAmount
        }
        calculateTotal(true);
        localStorage.bankAccountId = $scope.bankAccount.selected.id
        localStorage.paymentDate = $('#paymentdate').val()
        var pDate = getDate($scope.paymentdate)
        //  var pDate = getDate($scope.paymentdate)

        //visible  and is uo 
        var isUo
        var visible
        var paymentNo
        if (authService.userHasPermission('usertype:O')) {
            isUo = false
            visible = $scope.visible
           // paymentNo = $scope.paymentNo
        }
        if (authService.userHasPermission('usertype:UO')) {
            isUo = true
            visible = true
           // paymentNo = "UO" + $scope.paymentNo
        }
        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role:localStorage['usertype'],
            date: paymentDate,
            username: authService.getAuthentication().username,
            amount: $scope.totalPaidAmount,
            amountIndollar: $scope.totalDollarAmount,
            balanceAmtDollar: $scope.balanceAmtDollar,
            forexAmount: Math.abs($scope.forexAmount),
            forexCredit: $scope.credit,
            totalBankAmount: $scope.totalBankAmount,
            vochNo: $scope.paymentNo,
            custom:$scope.custom,
            state: "PAID",
            remark: $scope.remarks,
            visible: visible,
            isUo: isUo,
            vo_payment: {
                bankAccountId: $scope.bankAccount.selected.id,
                forexAccountId:$scope.forex.selected.id,
                partyAccountId: $scope.partyAccount.selected.id,
                paymentAmount: $scope.totalInvoiceAmount,
                balanceAmtReceipt: $scope.balanceAmtReceipt,
                currency: $scope.currency,
                exchangeRate: $scope.ExchangeRateINR,
                remarks: $scope.remarks,
                billDetail: $scope.itemChecked,
                accountlineItem: $scope.accountTable,
                attachements: attachements
            },
        }
        if (sharedFactory.info != null) {
            data.compCode = sharedFactory.info.selectedCompany2.CompanyId;
            data.vo_payment.companyName = sharedFactory.info.selectedCompany2.CompanyName;// localStorage[data.compCode];
            data.vo_payment.partyAccountName = localStorage[data.vo_payment.partyAccountId];
            if (sharedFactory.info.selectedPaymentIndex != null && sharedFactory.info.payments && sharedFactory.info.payments.length > 0) {
                sharedFactory.info.payments[sharedFactory.info.selectedPaymentIndex] = data;
            } else {
                sharedFactory.info.payments.push(data);
            }
            $scope.goBack(true);
        } else {
            $http.post(config.login + 'payment?id=' + $stateParams.voId + "&custom=" + $scope.custom, data)
                     .then(function (response) {
                         if (response.data.err) {
                             $rootScope.$broadcast('event:error', { message: "Error while creating Payment: " + response.data.err });
                         } else {
                             $rootScope.$broadcast('event:success', { message: "Payment Done." });
                             //SweetAlert.swal("Done", "Receipt Created.", "success")
                             //showSuccessToast("Receipt Created.");
                             if (reload == 'true') {
                                 $state.go('Customer.Payment', { voId: null , pDate: pDate }, { reload: true });
                             } else {
                                 $state.go('Customer.Payment', { 
                                     
                                     voId: response.data.id,
                                    
                             },
                                 { reload: true });
                             }
                           
                             //showSuccessToast("Payment Received.");
                             //$state.reload();
                         }

                     }, function (err) {
                         console.log(err);
                         //SweetAlert.swal("Error", "Error while creating receiipt", "error");
                         //SweetAlertError();
                         $rootScope.$broadcast('event:error', { message: "Error while creating payment" });
                         //spinner.stop();
                         //res.reject();
                     });
        }

    }
    
    function fillRosemateData() {
        $scope.bankAccount = { selected: sharedFactory.info.cashAccount.selected };
        if (sharedFactory.info.paymentDate)
            setDate($scope.paymentdate, sharedFactory.info.paymentDate);
        if (sharedFactory.info.purPartyAccount) {
            $scope.partyAccount = { selected: sharedFactory.info.purPartyAccount.selected };
        }
        if (sharedFactory.info.amtPurchase) {
            $scope.totalPaidAmount = sharedFactory.info.amtPurchase;
            $scope.balanceAmtReceipt = sharedFactory.info.amtPurchase;
        }
        if (sharedFactory.info.selectedPaymentIndex != null && sharedFactory.info.payments && sharedFactory.info.payments.length > 0) {
            //fillreceipt info
            fillData(sharedFactory.info.payments[sharedFactory.info.selectedPaymentIndex]);
        }
        else {
            $scope.getOpenInvoice($scope.partyAccount);
        }
    }
    
    function accountTableSum() {
        var amount = 0;
        for (var i = 0; i < $scope.accountTable.length; i++) {
            amount += Number($scope.accountTable[i].amount);
        }
        Number(amount.toFixed(2));
        return Number(amount.toFixed(2));
    }
    function getPaymentdata(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        fillData(response.data)
                    });
    }
    function getBankAccountBalance(id) {
        commonService.getOpeningBalance(id).then(function (response) {
            if (response.data) {
                $scope.cashAccountBalance = response.data.balance
            } else {
                $scope.cashAccountBalance = 0.00;
            }
        });
    }
    function gePartyAccountBalance(id) {
        commonService.getOpeningBalance(id).then(function (response) {
            if (response.data) {
                $scope.salesAccountBalance = response.data.balance
            } 
        });
    }
    function fillData(data) {
        console.log(data.date)
        $scope.state = data.state
        $scope.accountTable = [];
        if (data.amountIndollar) {
            $scope.totalDollarAmount = data.amountIndollar
            $scope.balanceAmtDollar = data.balanceAmtDollar
        }
        $scope.state = data.state;
        $scope.currency = data.vo_payment.currency;
        $scope.currency1($scope.currency)
        $scope.ExchangeRateINR = data.vo_payment.exchangeRate;
        $scope.totalPaidAmount = data.amount;
        $scope.balanceAmtReceipt = data.vo_payment.balanceAmtReceipt;
        $scope.paymentNo = data.vochNo;
        $scope.itemChecked = data.vo_payment.billDetail;
        $scope.bankAccount = { selected: { accountName: localStorage[data.vo_payment.bankAccountId], id: data.vo_payment.bankAccountId } };
        $scope.partyAccount = { selected: { accountName: localStorage[data.vo_payment.partyAccountId], id: data.vo_payment.partyAccountId } };

        $scope.custom = data.custom
        if (data.forexCredit == true) {
            $scope.totalforexGain = data.forexAmount
            $scope.credit = true
            $scope.forexAmount = data.forexAmount
        }
        if (data.forexCredit == false) {
            $scope.totalforexLoss = data.forexAmount
            $scope.credit = false
        }
       // gePartyAccountBalance(data.vo_payment.partyAccountId)
        $scope.forex = { selected: { accountName: localStorage[data.vo_payment.forexAccountId], id: data.vo_payment.forexAccountId } };
        setDate($scope.paymentdate, data.date);
        $scope.remarks = data.remark;
        $scope.attachements = data.vo_payment.attachements;
        $scope.accountTable = data.vo_payment.accountlineItem
        if (data.vo_payment.accountlineItem.length > 0) {
            $scope.totalBankAmount = $scope.totalPaidAmount + accountTableSum();
        } else {
            $scope.totalBankAmount = $scope.totalPaidAmount 
        }
        bindAttachments(data.vo_payment.attachements, function () {
            $scope.oldAttachment = null;
        });
        calculateTotal(false);
        $scope.getOpenInvoice($scope.partyAccount, data.vo_payment.partyAccountId);
        getBankAccountBalance(data.vo_payment.bankAccountId)
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
   
    $scope.$on("event:accountReferesh", function (event, args) {
        // Refresh accounts...
        getAccounts();
    });
    $scope.cashAccountSelected = function (data) {
        $scope.cashAccountType = data.balanceType == 'debit' ? " (Dr.) " : " (Cr.)";
       // var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(data.id).then(function (response) {
            if (response.data) {
                $scope.cashAccountBalance = response.data.balance
            } else {
                $scope.cashAccountBalance = 0.00;
            }
        });
    }
    $scope.accounts = {}
    $scope.getExpenseAccount = function () {
        $http.get(config.login + "getExpenseAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.expenseAccount = response.data
        });
    }
    $scope.$on("event:accountReferesh", function (event, args) {
        // Refresh accounts...
       
        $scope.getExpenseAccount();
    });
    
    $scope.getExpenseAccount();
    $scope.selectedAccIndex = null;
    $scope.editAccountTable = function (data, index) {
        if (index === $scope.selectedAccIndex) {
            $scope.selectedAccIndex = null;
            $scope.accounts = null;
            $scope.accountAmount = null;
        } else {
            $scope.selectedAccIndex = index;
            $scope.accounts = { selected: data };
            $scope.accountAmount = data.amount;
        }
    }
   
    $scope.addAccount = function () {
        if ($scope.accounts == null || $scope.accounts.selected == null) {
            showErrorToast("please select account");
            return;
        }
        if (isNaN($scope.accountAmount) || $scope.accountAmount == null) {
            showErrorToast("please enter amount");
            return;
        }
        var accountData = {
            accountName: $scope.accounts.selected.accountName,
            accountId: $scope.accounts.selected.id,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }
        if ($scope.selectedAccIndex != null) {
            $scope.accountTable[$scope.selectedAccIndex] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.totalBankAmount = $scope.totalPaidAmount + accountTableSum();
        $scope.accountAmount = null;
        $scope.selectedAccIndex = null
       
    }

    $scope.removeAccountTable = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.totalBankAmount = $scope.totalPaidAmount + accountTableSum();
        accountTableSum
        $scope.selectedAccIndex = null;
    }


}]);