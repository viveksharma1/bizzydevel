myApp.controller('ReceiptCntrl', ['$scope', '$q', '$http', '$timeout', '$rootScope', '$state', '$stateParams', 'config', '$filter', 'FileUploader', 'sharedFactory', '$uibModal', 'SweetAlert', function ($scope, $q, $http, $timeout, $rootScope, $state, $stateParams, config, $filter, FileUploader, sharedFactory, $uibModal, SweetAlert) {

    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    //localStorage["type1"] = "PAYMENT"
    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $scope.goBack = function (retain) {
        if ($rootScope.$previousState.name.length == 0 || $rootScope.$previousState==$state.current || $stateParams.noBackTrack) {
            window.history.back();
        }else
            $state.go($rootScope.$previousState);
        //if (!retain)
        //    sharedFactory.info = null;
        //window.history.back();
    },
    $(":file").filestyle({ buttonName: "btn-sm btn-info" });
    $scope.Accountbtn = function (id,type) {
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

    //$scope.no = $stateParams.poNo;
    $scope.bankAccount = {};
    $scope.partyAccount = {};
    $scope.badlaAccount = {};
    $scope.badlaAccounts = [];
    $scope.badlaDate = 'badlaDate';
    $scope.paymentdate = 'paymentdate';
    $scope.oldAttachment = null;
    $('#paymentdate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });
    $('#badlaDate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });
    //$scope.paymentdate = $filter('date')(new Date(), 'dd/MM/yyyy');
    //$scope.badlaDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    //$scope.dateFormat = function (date) {
    //    var res = date.split("/");
    //    console.log(res);
    //    var month = res[1];
    //    var days = res[0]
    //    var year = res[2]
    //    var date = month + '/' + days + '/' + year;
    //    return date;
    //}
    $scope.getSupplier = function () {
        $http.get(config.login + "getPartytAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.partyAccounts = response.data;
            angular.copy($scope.partyAccounts, $scope.badlaAccounts);
            console.log($scope.partyAccounts);
        });
    }
    $scope.getAccount = function () {
        $http.get(config.login + "getPaymentAccount/" + localStorage.CompanyId).then(function (response) {
            $scope.bankAccounts = response.data
            console.log($scope.bankAccounts);
        });
    }
    //$scope.getBadlaAccount = function () {
    //    //http://localhost:4000/api/accounts?filter[where][compCode]=COM2016123456780&filter[where][ancestor]=SUNDRY%20DEBTORS
    //    $http.get(config.api + "accounts?filter[where][compCode]=" + localStorage.CompanyId + "&filter[where][ancestor]=SUNDRY DEBTORS").then(function (response) {
    //        $scope.badlaAccounts = response.data
    //        console.log($scope.badlaAccounts);
    //    });
    //}
    $scope.mode = "new";
    var datas = [];
    $scope.balanceAmtReceipt = 0;
    $scope.paymentData = [];
    $scope.paidData = [];
    $scope.isInterest = localStorage.usertype == 'UO' ? true : false;
    $scope.itemChecked = [];
    var type = $stateParams.type;
    console.log(type);
    $scope.partyAccountSelected = function () {
        if ($scope.partyAccount.selected && $scope.partyAccount.selected.id) {
            if (localStorage['usertype'] == 'O') {
               getAllBill($scope.partyAccount.selected.id);
            }
            else {
               getAllBill($scope.partyAccount.selected.id);
            }
        }

    };
    if (sharedFactory.info != null) {
        $scope.mode="return";
        //$scope.purInfo = sharedFactory.info;
        setDate($scope.paymentdate);
        setDate($scope.badlaDate);
        fillRosemateData();
    }
    else if ($stateParams.voId) {
        $scope.mode = "edit";
        getPaymentdata($stateParams.voId);
    } else {
        $scope.mode = "new";
        setDate($scope.paymentdate);
        setDate($scope.badlaDate);
    }
   
    //}
    function getAllBill(id) {
        $http.get(config.login + "getVoucherData" + "?customerId=" + id).then(function (response) {
            $scope.paymentData = response.data
            angular.copy($scope.paymentData, $scope.paidData);
            checkPaymentBills();
        });
    }
    
    $scope.getAccount();
    //$scope.getBadlaAccount();
    $scope.getSupplier();
    if($scope.mode!="edit") getVoucherCount();
    //$scope.openTransaction = function (id, voType) {

    //    if (voType == 'BILL') {

    //        $state.go('Customer.Bill', { billNo: id });
    //    }
    //    if (voType == 'Expense') {

    //        $state.go('Customer.Expense', { expenceId: id });
    //    }
    //    if (voType == 'Sales Invoice') {

    //        $state.go('Customer.SalesInvoice', { voId: id });
    //    }
    //    if (voType == 'General Invoice') {

    //        $state.go('Customer.GeneralInvoice', { voId: id });
    //    }
    //}
    $scope.totalInvoiceAmount = 0;

    function getVoucherCount(callback) {
        if ($scope.mode=="edit") {
            if (callback) callback();
        } else {
            $http.get(config.api + "voucherTransactions/count" + "?[where][type]="+type).then(function (response) {
                $scope.paymentNo = response.data.count + 1;
                //console.log(response);
                if (callback) callback();
            });
        }
    }
    $scope.deleteReceipt = function () {
        var data = {
            compCode: localStorage.CompanyId,
            type: type,
            role: localStorage['usertype']
        }
        $http.post(config.login + 'deleteReceipt?id=' + $stateParams.voId, data)
                            .then(function (response) {
                                if (response.data.err) {
                                    $rootScope.$broadcast('event:error', { message: "Error while creating receipt: " + response.data.err });
                                } else {
                                    showSuccessToast("Receipt deleted.");
                                    $scope.goBack();// $state.reload();
                                }
                            }, function (err) {
                                console.log(err);
                                $rootScope.$broadcast('event:error', { message: "Error while deleting receipt" });

                            });
    }
    $scope.receivePayment = function () {
        var paymentDate = getDate($scope.paymentdate);
        var badlaDate = getDate($scope.badlaDate);
        if (!$scope.paymentdate) {
            showErrorToast("Please select receipt date");
            return;
        }
        if ($scope.bankAccount.selected == undefined || $scope.bankAccount.selected == null) {
            showErrorToast("Please select bank/cash account");
            return;
        }
        if ($scope.partyAccount.selected==undefined || $scope.partyAccount.selected == null) {
            showErrorToast("Please select party account");
            return;

        }
        if (!$scope.totalPaidAmount) {
            showErrorToast("Please enter amount.");
            return;
        }
        if ($scope.chkBadla && $scope.itemChecked.length > 1) {
            showErrorToast("Please select only one invoice while selecting badla");
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
        getVoucherCount(function () {
            var badla = undefined;
            if ($scope.chkBadla) {
                badla = {
                    amount: $scope.badlaAmount,
                    partyAccountId: $scope.badlaAccount.selected.id,
                    date: badlaDate,// $scope.dateFormat($scope.badlaDate),
                    conditons: {
                        dayTotal: $scope.totaldays,
                        dayInterest: $scope.dayInterest,
                        dayDiff: $scope.dayDiff,
                        perTotal: $scope.perTotal,
                        perInterest: $scope.perInterest,
                        perDiff: $scope.perDiff
                    }
                }
            }
            var data = {
                compCode: localStorage.CompanyId,
                type: type,
                role: localStorage['usertype'],
                date: paymentDate,// $scope.dateFormat($scope.paymentdate),
                amount: $scope.totalPaidAmount,
                vochNo: $scope.paymentNo,
                state: "PAID",
                remark: $scope.remarks,
                vo_payment: {
                    bankAccountId: $scope.bankAccount.selected.id,
                    partyAccountId: $scope.partyAccount.selected.id,
                    paymentAmount: $scope.totalInvoiceAmount,
                    balanceAmtReceipt: $scope.balanceAmtReceipt,
                    remarks: $scope.remarks,
                    billDetail: $scope.itemChecked,
                    badla: badla,
                    attachements:attachements
                },
                vo_badla:getBadlaVoucherInfo()
            };
            //if ($scope.chkBadla) {
            //    datas.push(data);
            //    pushBadlaVoucherInfo();
            //}
            //else {
                if (sharedFactory.info != null) {
                    data.compCode = sharedFactory.info.selectedCompany1.CompanyId;
                    data.vo_payment.companyName = sharedFactory.info.selectedCompany1.CompanyName;// localStorage[data.compCode];
                    data.vo_payment.partyAccountName = localStorage[data.vo_payment.partyAccountId];
                    if (sharedFactory.info.selectedReceiptIndex !=null && sharedFactory.info.receipts && sharedFactory.info.receipts.length > 0) {
                        sharedFactory.info.receipts[sharedFactory.info.selectedReceiptIndex] = data;
                    } else {
                        sharedFactory.info.receipts.push(data);
                    }
                    $scope.goBack(true);
                }
                else {
                    $rootScope.$broadcast('event:progress', { message: "Please wait while processing.."});
                    //SweetAlert.swal("In Progress", "", "loading");
                    //spinner.start();
                    //var res = $q.defer();
                    $http.post(config.login + 'receipt?id=' + $stateParams.voId, data)
                             .then(function (response) {
                                 if (response.data.err) {
                                     $rootScope.$broadcast('event:error', { message: "Error while creating receipt: "+response.data.err });
                                 } else {
                                     $rootScope.$broadcast('event:success', { message: "Receipt Created" });
                                     //SweetAlert.swal("Done", "Receipt Created.", "success")
                                     //showSuccessToast("Receipt Created.");
                                     $state.go('Customer.Receipt', null, { location: false, reload: true });
                                     //spinner.stop();
                                     //res.reject();
                                     //res.resolve();
                                 }
                             }, function (err) {
                                 console.log(err);
                                 //SweetAlert.swal("Error", "Error while creating receiipt", "error");
                                 //SweetAlertError();
                                 $rootScope.$broadcast('event:error', { message: "Error while creating receipt" });
                                 //spinner.stop();
                                 //res.reject();
                             });
                    //res.promise;
                }
            //}
            


        })
        

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
                    if (!$scope.isInterest)
                        item.interest = 0;
                    delete item.invoiceData;
                }

            });
        } else {
            $scope.totalInvoiceAmount = 0;
        }
    }
    function getBadlaVoucherInfo() {
        if ($scope.chkBadla) {
            var badlaDate = getDate($scope.badlaDate);
            var badlaDueDate = moment(badlaDate).add(Number($scope.dayTotal), 'days');
            ///var  badlaDueDate = moment($scope.badlaDate, "DD/MM/YYYY").add(Number($scope.dayTotal), 'days').format('DD/MM/YYYY');
            var data = {
                compCode: localStorage.CompanyId,
                type: "Badla Voucher",
                role: localStorage['usertype'],
                date: badlaDate,
                duedate: badlaDueDate,
                amount: $scope.badlaAmount,
                //vochNo: $scope.paymentNo + 1,
                balance: $scope.badlaAmount,
                state: "OPEN",
                remark: $scope.remarks,
                customerId: $scope.badlaAccount.selected.id,
                vo_badla: {
                    billDetail: $scope.itemChecked,
                    partyAccountId: $scope.partyAccount.selected.id,
                    partyAccountName: $scope.partyAccount.selected.accountName,
                    badlaAccountId: $scope.badlaAccount.selected.id,
                    paymentAmount: $scope.badlaAmount,
                    remarks: $scope.remarks,
                    conditons: {
                        dayTotal: $scope.dayTotal,
                        dayInterest: $scope.dayInterest,
                        dayDiff: $scope.dayDiff,
                        perTotal: $scope.perTotal,
                        perInterest: $scope.perInterest,
                        perDiff: $scope.perDiff
                    }
                }
            };
            return data;
        }
    //datas.push(data);
    //$http.post(config.login + 'saveBadlaVoucher?id=' + $stateParams.voId, datas)
    //             .then(function (response) {
    //                 showSuccessToast("Payment Received.");
    //                 $state.reload();

    //             });
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


    function fillRosemateData(){
        $scope.bankAccount = { selected: sharedFactory.info.cashAccount.selected };
        if(sharedFactory.info.paymentDate)
            setDate($scope.paymentdate, sharedFactory.info.paymentDate);
        if (sharedFactory.info.salePartyAccount) {
            $scope.partyAccount = { selected: sharedFactory.info.salePartyAccount.selected };
        }
        if (sharedFactory.info.amtSale) {
            $scope.totalPaidAmount = sharedFactory.info.amtSale;
            $scope.balanceAmtReceipt = sharedFactory.info.amtSale;
        }
        if(sharedFactory.info.selectedReceiptIndex!=null && sharedFactory.info.receipts && sharedFactory.info.receipts.length>0)
        {
            //fillreceipt info
            fillData(sharedFactory.info.receipts[sharedFactory.info.selectedReceiptIndex]);
        } else {
            $scope.partyAccountSelected();
        }
    }
    function getPaymentdata(id) {
        $http.get(config.api + 'voucherTransactions/' + id)
                    .then(function (response) {
                        fillData(response.data);
                    });
    }
    function fillData(data){
        $scope.bindingEdit = true;
        //console.log(response);
        $scope.state = data.state;
        $scope.totalPaidAmount = data.amount;
        $scope.balanceAmtReceipt = data.vo_payment.balanceAmtReceipt;
        $scope.paymentNo = data.vochNo;
        $scope.itemChecked = data.vo_payment.billDetail;
        $scope.bankAccount = { selected: { accountName: localStorage[data.vo_payment.bankAccountId], id:data.vo_payment.bankAccountId } };
        console.log(data.vo_payment.bankAccount);
        $scope.partyAccount = { selected: { accountName: localStorage[data.vo_payment.partyAccountId],id: data.vo_payment.partyAccountId } };
        setDate($scope.paymentdate, data.date);
        //$scope.paymentdate = $filter('date')(data.date, 'dd/MM/yyyy');
        //fill badla info if exists
        $scope.attachements = data.vo_payment.attachements;
        bindAttachments(data.vo_payment.attachements, function () {
            $scope.oldAttachment = null;
        });
        var badlaInfo = data.vo_payment.badla;
        if(badlaInfo)
        {
            $scope.chkBadla = true;
            setDate($scope.badlaDate, badlaInfo.data);
            //$scope.badlaDate = $filter('date')(badlaInfo.data, 'dd/MM/yyyy');
            $scope.badlaAccount = { selected: { id: badlaInfo.partyAccountId } };
            $scope.badlaAmount = badlaInfo.amount;
            $scope.dayTotal = badlaInfo.conditons.dayTotal;
            $scope.dayInterest = badlaInfo.conditons.dayInterest;
            $scope.dayDiff = badlaInfo.conditons.dayDiff;
            $scope.perTotal = badlaInfo.conditons.perTotal;
            $scope.perInterest = badlaInfo.conditons.perInterest;
            $scope.perDiff = badlaInfo.conditons.perDiff;
        }

        calculateTotal(false);
        $scope.partyAccountSelected();
    }
    //var Promise = window.Promise;
    //if (!Promise) {
    //    Promise = JSZip.external.Promise;
    //}
    ///**
    // * Fetch the content and return the associated promise.
    // * @param {String} url the url of the content to fetch.
    // * @return {Promise} the promise containing the data.
    // */
    //function urlToPromise(url) {
    //    return new Promise(function (resolve, reject) {
    //        var req = new XMLHttpRequest();
    //        req.open('get', url);
    //        req.responseType = "arraybuffer";
    //        req.onreadystatechange = function () {
    //            if (req.readyState == 4 && req.status == 200) {
    //                try {
    //                    resolve(req.response);// JSZipUtils._getBinaryFromXHR(xhr);
    //                } catch (e) {
    //                    reject(new Error(e));
    //                }
    //            }
    //        };
    //        req.send();
    //    });
    //}

    //if (!JSZip.support.blob) {
    //    showError("This demo works only with a recent browser !");
    //    return;
    //}
    
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
    $scope.$watch('paymentdate', function () {
        if (paymentdate)
            paymentDateChange();

    });
    $scope.totalPaidAmountChanged=function(){
    //$scope.$watch('totalPaidAmount', function () {
        //if (!$scope.bindingEdit) {
            if ($scope.itemChecked.length > 0) {
                $scope.itemChecked = [];
                angular.copy($scope.paidData, $scope.paymentData);
            }
            $scope.balanceAmtReceipt = $scope.totalPaidAmount;
        //}

    }
    //);
    //$scope.$watch('itemChecked', function () {
    //    calculateTotal(false);

    //},true);
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

    
    
    $scope.selectLineItem = function (itemData, force) {
        if ($scope.totalPaidAmount && $scope.totalPaidAmount > 0) {
            if (itemData) {
                var item = {};
                if (itemData.select && !force) {
                    itemData.amountPaid = getBalanceAmtReceipt(itemData.balance);
                    getIneterest(itemData, itemData.amountPaid, true);
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
                            itemData.interest = 0;
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
            }
        } else {
            showErrorToast("Please enter paid amount.");
            itemData.select = false;
        }
        calculateTotal(false);

    }
    function getDays(item) {
        try {
            return moment($scope.paymentdate, "DD/MM/YYYY").diff(moment(item.date), "days", true);
        } catch (e) {
            showErrorToast("Please select payment date");
            ret = 0;
        }
    }
    function getLastDigit(value){
       return value.toString().split('').pop()
    }
    function getIneterest(item, payAmount, inline) {
        var ret=0;
        if (item.type == 'Badla Voucher') {

            var badlaCondition=item.vo_badla.conditons;


            var days = getDays(item);
            var days2 =days- badlaCondition.dayTotal;
            var days3 = Math.max(days - badlaCondition.dayInterest,0);
            var perOnRec = days < badlaCondition.dayInterest ? 0 : badlaCondition.perInterest;// IF(M35<$G$28,0,$G$29)
            var interest1 = payAmount * ((days2 < 0 ? badlaCondition.perTotal / 100 : badlaCondition.perDiff / 100) / 30) * (days2 < 0 ? days2 : badlaCondition.dayDiff * -1);
            var interest2 = payAmount * (perOnRec/100 / 30) * getLastDigit(days3);
            ret = interest1 + interest2;
            ret = Number(ret.toFixed(2));
            //var dayCal = days - Number(item.invoiceData.paymentDays == undefined ? 0 : item.invoiceData.paymentDays);
            //ret = Number((payAmount * (item.invoiceData.roi / (100 * 30)) * dayCal).toFixed(2));



        }else{
            try{
                var days = getDays(item);
                var dayCal = days - Number(item.invoiceData.paymentDays == undefined ? 0 : item.invoiceData.paymentDays);
                if (localStorage.usertype == 'O') {
                    dayCal = dayCal < 0 ? 0 : dayCal;
                }
                ret= Number((payAmount * (item.invoiceData.roi /100/30) * dayCal).toFixed(2));
            } catch (e) {
                console.log(e);
                ret = 0;
            }
            
            
        }
        if (inline) item.interest = ret;
        else return ret;
    }
    $scope.amountChange = function (item, payAmount, oldPayAmount) {
        if(payAmount!=null)
        $scope.selectLineItem(item, true);

        if ($scope.itemChecked.length > 0) {
            for (var i = 0; i < $scope.itemChecked.length; i++) {
                if (item) {
                    if ($scope.itemChecked[i].id == item.id) {
                        if ($scope.itemChecked[i].old) 
                            $scope.itemChecked[i].balance += Number(oldPayAmount) - Number(payAmount);
                        if ($scope.itemChecked[i].balance - payAmount >= 0) {
                            payAmount = getBalanceAmtReceipt(payAmount);
                            $scope.itemChecked[i].amountPaid = payAmount;
                            var interest = getIneterest(item, payAmount);
                            $scope.itemChecked[i].interest = interest;
                            item.interest = interest;
                            item.balance = $scope.itemChecked[i].balance;
                            item.amountPaid = payAmount;
                            
                        } else {
                            if (oldPayAmount && oldPayAmount.length > 0) {
                                var payAmount=getBalanceAmtReceipt(item.balance);
                                item.amountPaid = payAmount;
                                $scope.itemChecked[i].amountPaid = payAmount;
                                var interest = getIneterest(item, payAmount);
                                $scope.itemChecked[i].interest = interest;
                                item.interest = interest;
                                item.balance = $scope.itemChecked[i].balance;
                            }
                                
                        }
                        break;
                    }
                }
           }
        }
        if (payAmount == null)
            $scope.selectLineItem(item, true);
        calculateTotal(false);
    };
    function paymentDateChange() {
        angular.forEach($scope.paymentData,function(item){
            if (Number(item.amountPaid) > 0)
                $scope.amountChange(item, item.amountPaid);
        })
        
    }
    //function applyRate(rate, item) {
    //        if ($scope.itemChecked.length > 0) {

    //            for (var i = 0; i < $scope.itemChecked.length; i++) {
    //                if (item) {
    //                    if ($scope.itemChecked[i].id == item.id) {
    //                        $scope.itemChecked[i].itemRate = rate
    //                        $scope.itemChecked[i].itemAmount = item.itemAmount;
    //                        if (item.itemQty)
    //                            $scope.itemChecked[i].itemQty = item.itemQty;
    //                        break;
    //                    }
    //                } else {
    //                    $scope.itemChecked[i].itemRate = rate
    //                    $scope.itemChecked[i].itemAmount = rate * Number($scope.itemChecked[i].itemQty);
    //                    $scope.itemChecked[i].select = true;
    //                }

    //            }
    //            if ($scope.selectAllItem && !item)
    //                angular.copy($scope.itemChecked, $scope.filterList);
    //            sumItemTable($scope.itemChecked);
    //        }


    //}
    function clearBadlaBox() {
        $scope.badlaAmount = null;
        $scope.badlaAccount = { seleced: {} };//badlaAmount
        setDate($scope.badlaDate);
        //$scope.badlaDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.dayTotal = null;
        $scope.dayInterest = null;
        $scope.dayDiff = null;
        $scope.perTotal = null;
        $scope.perInterest = null;
        $scope.perDiff = null;
    }
    $scope.selectbadla = function () {
        if ($scope.chkBadla) {
            $scope.badlaAmount = $scope.itemChecked[0].balance
            $scope.badlaForBill = $scope.itemChecked[0];
        }
        else {
            clearBadlaBox();
        }

    };

}]);