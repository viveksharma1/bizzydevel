myApp.controller('PaymentCntrl', ['$scope', '$http', '$stateParams', '$timeout', 'myService', '$rootScope', '$state', 'config', '$filter', 'FileUploader', 'sharedFactory', function ($scope, $http, $stateParams, $timeout, myService, $rootScope, $state, config, $filter, FileUploader, sharedFactory) {

    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    //localStorage["type1"] = "PAYMENT"
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        if ($rootScope.$previousState.name.length == 0) {
            window.history.back();
        } else
            $state.go($rootScope.$previousState);
    },
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
        //$('#formaccount').modal('show');
    };
    $scope.add = function (type, value) {
        $('#formaccount').modal('show');
        $scope.myValue = { accountName: value };
    }
    //$('#paymentdate').datepicker("setDate", new Date());

    $('#paymentdate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });
    var type = $stateParams.type;
    $scope.bankAccount = {};
    $scope.partyAccount = {};
    $scope.paymentData = [];
    $scope.transaction = [];
    $scope.paidData = [];
    $scope.itemChecked = [];
    $scope.paymentdate = 'paymentdate';
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
    $scope.getVoucherCount = function () {
        $http.get(config.api + "voucherTransactions/count" + "?[where][type]="+type).then(function (response) {
            $scope.paymentNo = response.data.count + 1
           
        });
    }
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
    $scope.currency1 = function (currency) {
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
            //$scope.data = response.data;
            $scope.ExchangeRate = response.data.quotes.USDINR.toFixed(2);
            $scope.ExchangeRateINR = Number($scope.ExchangeRate)
            //$scope.ExchangeRateIDR = $scope.ExchangeRate1
        });

    }
    "get open invoice"
    $scope.getOpenInvoice = function () {
        if ($scope.partyAccount.selected && $scope.partyAccount.selected.id) {
            if (localStorage['usertype'] == 'O') {
                var fields = '&filter[fields][adminAmount]=false&filter[fields][adminBalance]=false&[filter][where][balance][gt]=0'
                getAllBill($scope.partyAccount.selected.id, fields);
            }
            else {
                var fields = '&filter[fields][amount]=false&filter[fields][balance]=false&[filter][where][adminBalance][gt]=0'
                getAllBill($scope.partyAccount.selected.id, fields);
            }
        }


    }


    if (sharedFactory.info != null) {
        $scope.mode = "return";
        //$scope.purInfo = sharedFactory.info;
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
        setDate($scope.paymentdate);
        $scope.currency = "Dollar";
        $scope.exchangeRate();
    }
    $scope.getAccount();
    $scope.getSupplier();
    $scope.getVoucherCount();

    $scope.paidAmountChanged= function () {
        resetToInitial();
    };
    function resetToInitial() {
        if ($scope.itemChecked.length > 0) {
            $scope.itemChecked = [];
            angular.copy($scope.paidData, $scope.paymentData);
        }
        $scope.balanceAmtReceipt = $scope.totalPaidAmount;
        calculateTotal(false);
    }
    function getBalanceAmtReceipt(amount) {
        if ($scope.totalPaidAmount && $scope.totalPaidAmount > 0) {
            var nextBal = $scope.balanceAmtReceipt - Number(amount);
            if (nextBal >= 0) {
                $scope.balanceAmtReceipt = nextBal;
            } else {
                amount = $scope.balanceAmtReceipt;
                $scope.balanceAmtReceipt = 0;
            }
        }

        return amount;
    }
    function addBalanceAmtReceipt(amount) {
        if ($scope.totalPaidAmount && $scope.totalPaidAmount > 0) {
            $scope.balanceAmtReceipt = $scope.balanceAmtReceipt + amount;
        }

    }
    $scope.amountChange = function (item, payAmount, oldPayAmount) {
        $scope.selectLineItem(item, true);

        if ($scope.itemChecked.length > 0) {
            for (var i = 0; i < $scope.itemChecked.length; i++) {
                if (item) {
                    if ($scope.itemChecked[i].id == item.id) {
                        if ($scope.itemChecked[i].balance - payAmount >= 0) {
                            payAmount = getBalanceAmtReceipt(payAmount);
                            $scope.itemChecked[i].amountPaid = payAmount;
                            //var interest = getIneterest(item, payAmount);
                            //$scope.itemChecked[i].interest = interest;
                            //item.interest = interest;
                            item.amountPaid = payAmount;
                        } else {
                            if (oldPayAmount && oldPayAmount.length > 0) {
                                var payAmount = getBalanceAmtReceipt(item.balance);
                                item.amountPaid = payAmount;
                                $scope.itemChecked[i].amountPaid = payAmount;
                                //var interest = getIneterest(item, payAmount);
                                //$scope.itemChecked[i].interest = interest;
                                //item.interest = interest;
                            }

                        }
                        break;
                    }
                }
            }
        }
        calculateTotal(false);
    };
    function paymentDateChange() {
        angular.forEach($scope.paymentData, function (item) {
            if (Number(item.amountPaid) > 0)
                $scope.amountChange(item, item.amountPaid);
        })

    }


    $scope.selectLineItem = function (itemData, force) {
        if (itemData) {
            if (!((itemData.invoiceType == "Domestic" && $scope.currency == "Rupee") || (itemData.invoiceType == "Import" && $scope.currency == "Dollar"))) {
                showErrorToast("Please select correct type of bill.");
                itemData.select = false;
                return;
            }
            //if (!(itemData.invoiceType == "Import" && $scope.currency == "Dollar")) {
            //    showErrorToast("Please select correct type of bill.");
            //    itemData.select = false;
            //    return;
            //}
            if (!($scope.totalPaidAmount && $scope.totalPaidAmount > 0)) {
                showErrorToast("Please enter paid amount.");
                itemData.select = false;
                return
            }
            var item = {};
            if (itemData.select && !force) {
                itemData.amountPaid = getBalanceAmtReceipt(itemData.balance);
                //getIneterest(itemData, itemData.amountPaid, true);
                //itemData.balance = 0;
                angular.copy(itemData, item);
                $scope.itemChecked.push(item);
                console.log($scope.itemChecked);
            } else {
                //$scope.selectAllItem = false;
                //angular.copy(itemData, item);
                for (var i = 0; i < $scope.itemChecked.length; i++) {
                    if ($scope.itemChecked[i].id == itemData.id) {

                        $scope.balanceAmtReceipt = $scope.balanceAmtReceipt + Number($scope.itemChecked[i].amountPaid);
                        $scope.itemChecked.splice(i, 1);
                        //if (force) {
                        itemData.select = false;
                        //itemData.interest = 0;
                        if (!force) {
                            //itemData.balance += Number(itemData.amountPaid);
                            itemData.amountPaid = 0;
                        }
                        //}
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
        $scope.totalInvoiceAmount = 0;
        if ($scope.itemChecked.length > 0) {
            angular.forEach($scope.itemChecked, function (item) {
                $scope.totalInvoiceAmount = $scope.totalInvoiceAmount + item.amountPaid;

                //item.roi = item.invoiceData.roi;
                //item.paymentDays = item.invoiceData.paymentDays;
                if (last && !item.old) {
                    item.balance = item.balance - item.amountPaid >= 0 ? item.balance - item.amountPaid : 0;
                    item.old = true;
                    //if (!$scope.isInterest)
                    //    item.interest = 0;
                    //delete item.invoiceData;
                }

            });
        } else {
            $scope.totalInvoiceAmount = 0;
        }
    }
    //$scope.createPaymentData = function (role) {
    //    if (role == 'O') {
    //        for (var i = 0; i < $scope.transaction.length; i++) {
    //            $scope.paymentData.push({
    //                date: $scope.transaction[i].date, billDueDate: $scope.transaction[i].dueDate, id: $scope.transaction[i].id, amount: $scope.transaction[i].amount, no: $scope.transaction[i].vochNo
    //                , ordertype: $scope.transaction[i].type, balance: $scope.transaction[i].balance
    //            });
    //        }

    //    }
    //    if (role == 'UO') {
    //        for (var i = 0; i < $scope.transaction.length; i++) {
    //            $scope.paymentData.push({
    //                date: $scope.transaction[i].date, billDueDate: $scope.transaction[i].dueDate, id: $scope.transaction[i].id, amount: $scope.transaction[i].amount, no: $scope.transaction[i].vochNo
    //                , ordertype: $scope.transaction[i].type, balance: $scope.transaction[i].balance
    //            });
    //        }
    //    }

    //    $scope.paidData = $scope.transaction;

       
    //}
   
    //$scope.getAllBill = function (id) {
    //    $http.get(config.login + "getVoucherData" + "?customerId=" + id).then(function (response) {
    //        $scope.paymentData = response.data
    //        angular.copy($scope.paymentData, $scope.paidData);
    //        checkPaymentBills();
    //    });
    //}
    function getAllBill(supliersId, fields) {
        if (supliersId){
            $http.get(config.login + "getAllTransaction/"+ supliersId).then(function (response) {
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
    function checkPaymentBills() {
        Array.prototype.push.apply($scope.paymentData, $scope.itemChecked);
        angular.copy($scope.paymentData, $scope.paidData);
    }
    
    //var savepaymentamount;
    //$scope.payBill = function (amount,balance, index, paymentamount, id) {

        
    //    if (savepaymentamount == paymentamount) {
    //        return;
    //    }
    //    else {
    //        if (balance >= paymentamount && paymentamount > 0) {
    //            if (amount == balance) {
    //                var paidAmount = Number(amount - paymentamount);
    //            }
    //            else {
    //                var paidAmount = Number(balance - paymentamount);
    //            }
    //            $scope.paidData[index].balance = paidAmount;
    //            $scope.paidData[index].amountPaid = paymentamount;
    //        }
    //    }
    //    console.log($scope.paidData)
    //    var savepaymentamount = paymentamount;
    //    $scope.paidDataTotal = paidData;
    //}

    $scope.savePayment = function () {
        var paymentDate = getDate($scope.paymentdate);
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
        calculateTotal(true);
        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role:localStorage['usertype'],
            date: paymentDate,//$scope.dateFormat($scope.paymentdate),
            amount: $scope.totalPaidAmount,
            vochNo: $scope.paymentNo,
            state: "PAID",
            remark: $scope.remarks,
            vo_payment: {
                bankAccountId: $scope.bankAccount.selected.id,
                partyAccountId: $scope.partyAccount.selected.id,
                paymentAmount: $scope.totalInvoiceAmount,
                balanceAmtReceipt: $scope.balanceAmtReceipt,
                currency: $scope.currency,
                exchangeRate: $scope.ExchangeRateINR,
                remarks: $scope.remarks,
                billDetail: $scope.itemChecked,
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
            $http.post(config.login + 'payment?id=' + $stateParams.voId, data)
                     .then(function (response) {

                         showSuccessToast("Payment Received.");
                         $state.reload();

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
        } else {
            $scope.getOpenInvoice();
        }
    }
  
    function getPaymentdata(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        fillData(response.data)
                    });
    }
    function fillData(data) {
        $scope.state = data.state;
        $scope.currency = data.vo_payment.currency;
        $scope.ExchangeRateINR = data.vo_payment.exchangeRate;
        $scope.totalPaidAmount = data.amount;
        $scope.balanceAmtReceipt = data.vo_payment.balanceAmtReceipt;
        $scope.paymentNo = data.vochNo;
        $scope.itemChecked = data.vo_payment.billDetail;
        $scope.bankAccount = { selected: { accountName: localStorage[data.vo_payment.bankAccountId], id: data.vo_payment.bankAccountId } };
        $scope.partyAccount = { selected: { accountName: localStorage[data.vo_payment.partyAccountId], id: data.vo_payment.partyAccountId } };
        setDate($scope.paymentdate, data.date);
        $scope.remarks = data.remark;
        $scope.attachements = data.vo_payment.attachements;
        bindAttachments(data.vo_payment.attachements, function () {
            $scope.oldAttachment = null;
        });
        calculateTotal(false);
        $scope.getOpenInvoice();
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
   
    

   
   



}]);