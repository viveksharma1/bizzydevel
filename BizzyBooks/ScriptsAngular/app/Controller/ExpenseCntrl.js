myApp.controller('ExpenseCntrl', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'commonService', 'config','$filter','FileUploader',
function ($scope, $http, $stateParams, $timeout, $rootScope, $state, commonService, config, $filter,FileUploader) {
        $.fn.datepicker.defaults.format = "dd/mm/yyyy";
        $(".my a").click(function (e) {
            e.preventDefault();
        })

        $scope.goBack = function () {
            window.history.back();
        }
        $scope.popuclose = function () {
            $('#form-popoverPopup').hide();
        }
        var files, res;
        $scope.visible = true
        $scope.clear = function ($event, $select) {
            $event.stopPropagation();
            $select.selected = null;
            $select.search = undefined;

            $timeout(function () { $select.activate() }, 300);
        }
        function uploadOnChange() {
            var filename = this.value;
            var lastIndex = filename.lastIndexOf("\\");
            if (lastIndex >= 0) {
                filename = filename.substring(lastIndex + 1);
            }
            files = $('#uploadBtn')[0].files;
            res = Array.prototype.slice.call(files);
            for (var i = 0; i < files.length; i++) {
                $("#upload_prev").append("<span>" + files[i].name + "&nbsp;&nbsp;<b>X</b></span>");
            }

        }

        $(document).on("click", "#upload_prev span", function () {
            res.splice($(this).index(), 1);
            $(this).remove();
           


        })

        $('.Countedit td').click(function () {
            $(this).closest('tr').find('.Count').hide();
            $(this).closest('tr').find('.Count2').show();

        })

        $('.savetr').click(function () {
            $(this).closest('tr').find('.Count').show();
            $(this).closest('tr').find('.Count2').hide();

        })


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

        $scope.AddAccountTableLine = function () {
            $('#AccountTableLine tr:last').after('<tr class="Countedit"><td class="text-right Count" style="width:50px" data-field="Count">&nbsp;</td><td class="Count" data-field="Account">&nbsp;</td><td class="Count" data-field="Description">&nbsp;</td><td class="text-right Count" data-field="Amount">&nbsp;</td><td class="text-right Count"><a> <i class="fa fa-pencil" style="font-size:16px"></i></a></td><td class="text-right Count2" style="width:50px" data-field="Count"><input type="text" class="form-control" value="4" /></td><td class="Count2" data-field="Account"><ui-tree-Account model="model"></ui-tree-Account></td><td class="Count2" data-field="Description"><input type="text" class="form-control" /></td><td class="text-right Count2" data-field="Amount"><input type="text" class="form-control" /></td><td class="text-right Count2 savetr"><a> <i class="fa fa-save" style="font-size:16px"></i></a></td></tr>');
        }
        $scope.AddTableLine = function () {
            $('#ItemTable tr:last').after('<tr class="Countedit"><td class="Count">&nbsp;</td><td class="Count" style="text-align:center;">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="text-right Count"><a class="edit" title="Edit"> <i class="fa fa-pencil" style="font-size:16px"></i></a></td><td class="Count2"><ui-tree-select model="model"></ui-tree-select></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control" value="" /></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /> </td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /></td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /></td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="text-right Count2 savetr"><a> <i class="fa fa-save" style="font-size:16px"></i></a></td></tr>');
        }
        $scope.add3 = function () {
            $('#formaccount').modal('show');
        }
        $scope.paymentTerm = function () {
            var days = 0;
            if ($scope.paymentDays)
                days = $scope.paymentDays;
            var expenseDate = getDate($scope.expenseDate);
            if (expenseDate)
                setDate($scope.expenseDueDate, moment(expenseDate).add(days, 'days'));
        }
        $('#expenseDate').datepicker({ assumeNearbyYear:true});
        $('#expenseDueDate').datepicker({ assumeNearbyYear: true });
        $scope.accounts = {};
        $scope.supplier = {};
        $scope.tdsRate = {};
        $scope.refNo = $stateParams.no;    
        $scope.accountTable = []; 
        $scope.idSelectedVote = null;
        //get supplier data

        //$scope.paymentTerm = function () {
        //    $scope.expenseDueDate = moment($scope.expenseDate, "DD/MM/YYYY").add($scope.paymentDays, 'days').format('DD/MM/YYYY');
        //}

        
        //bind file attachement
        $scope.oldAttachment = null;
        function bindAttachments(attachments, callback) {
            if (attachments) {
                angular.forEach(attachments, function (item) {
                    $scope.oldAttachment = item;

                    item.file.isOld = true;
                    uploader.addToQueue(item.file);

                });
            }
            if (callback)
                callback();
        }
     $scope.getSupplier = function () {
           $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
               $scope.supliers = response.data
           });
     }
     $scope.getExpenseAccount = function () {
         $http.get(config.login + "getExpenseAccount/" + localStorage.CompanyId).then(function (response) {
             $scope.account = response.data
         });
     }
     $scope.$on("event:accountReferesh", function (event, args) {
         // Refresh accounts...
         $scope.getSupplier();
         $scope.getExpenseAccount();
     });
     $scope.getExpenseAccount();
     $scope.getSupplier();
        
      
    
    $scope.bindAccountId = function (data) {
        var accountData = data;
        for (var i = 0; i < data.length; i++) {
            accountData[i].accountName = localStorage[data[i].accountId]
        }
        return accountData;
    }
    $scope.getExpenseData = function (expenseId) {  
        $http.get(config.api + 'voucherTransactions/'+ expenseId)
                    .then(function (response) {
                        var expenseData = response.data.transactionData;
                        console.log(response)
                        $scope.accountTable = $scope.bindAccountId(expenseData.accountTable);
                        $scope.itemTable = $scope.bindAccountId(expenseData.itemTable);
                        $scope.supplier = { selected: { accountName: localStorage[expenseData.supliersId], id: expenseData.supliersId } };
                        $scope.tdsRate = { selected: { accountName: localStorage[expenseData.tdsAccountId], id: expenseData.tdsAccountId } };
                        $scope.applyTdsRate(expenseData.tdsRate);
                        $scope.getSupplierDetail(expenseData.supliersId);
                        //$scope.expenseDueDate = $filter('date')(expenseData.billDueDate, 'dd/MM/yyyy');
                        //$scope.expenseDate = $filter('date')(expenseData.date, 'dd/MM/yyyy');
                        setDate($scope.expenseDueDate, expenseData.billDueDate);
                        setDate($scope.expenseDate, expenseData.date);
                        $scope.expenseId = expenseData.expenseId
                        $scope.paymentDays = expenseData.paymentDays
                        $scope.attachements = expenseData.attachements;
                        $scope.narration = response.data.narration
                        $scope.refNo = response.data.refNo
                        $scope.visible =  response.data.uoVisible
                        if (response.data.paymentLog) {
                            $scope.receiptCount = response.data.paymentLog.length;
                            $scope.receipts = response.data.paymentLog;
                        } else {
                            $scope.receiptCount = null;
                            $scope.receipts = [];
                        }
                        bindAttachments(expenseData.attachements, function () {
                            $scope.oldAttachment = null;
                        });
                        $scope.id = expenseData.id
                        $scope.accountTableSum();
                        $scope.itemTableSum();
                    });
    }

    if ($stateParams.expenceId) {   
        $scope.supplier = { selected: { company: $stateParams.suppliers } };
        $scope.getExpenseData($stateParams.expenceId)
        $scope.refNo = $stateParams.no
    }

    $scope.getSupplierDetail = function (id) {
        $scope.supliersDetail = []
        $http.get(config.api + "accounts/" + id).then(function (response) {
            $scope.supliersDetail = response.data;
            console.log(response.data)
            $scope.email = $scope.supliersDetail.email;
           
            $scope.shippingAddress = $scope.supliersDetail.billingAddress[0].street;
            if ($scope.supliersDetail.phone != undefined) {
                $scope.mobile = $scope.supliersDetail.mobile == undefined ? $scope.supliersDetail.phone : $scope.supliersDetail.mobile + "," + $scope.supliersDetail.phone
            }
        });
    }
    function calculateOpenningBalnce(data, balanceType) {
        var balance;
        if (balanceType == 'credit' && data.credit) {
            balance = Number(data.credit) - Number(data.debit)
        }
        if (balanceType == 'debit') {
            balance = Number(data.debit) - Number(data.credit)
        }
        return balance
    }
    $scope.bindSupplierDetail = function (data) {
        $scope.shippingAddress = ''
        $scope.email  = ''
        $scope.mobile = ''
        var balanceType = data.balanceType
        var url = config.login + "getOpeningBalnceByAccountName/" + localStorage.CompanyId + "?date=" + localStorage.toDate + "&accountName=" + data.id + "&role=" + localStorage.usertype
        commonService.getOpeningBalance(url, [localStorage.CompanyId]).then(function (response) {
            if (response.data.openingBalance) {
                $scope.supplierBalance = calculateOpenningBalnce(response.data.openingBalance, balanceType)
            } else {
                $scope.purchaseLedgerBalance = '';
            }
        })
        $scope.email = data.email
        if (data.phone != undefined) {
            $scope.mobile = data.mobile == undefined ? data.phone : data.mobile + "," + data.phone
        }
        $scope.shippingAddress = data.billingAddress[0].street
            
          
    }
    $scope.accountTableSum = function () {
        var total = 0;
        for (var i = 0; i < $scope.accountTable.length; i++) {
            var product = Number($scope.accountTable[i]);
            total += Number($scope.accountTable[i].amount);
        }
        $scope.totaltax1 = total.toFixed(2);
        $scope.totaltax = Number($scope.totaltax1)
        return $scope.totaltax;
    }
    $scope.Accountbtn = function (id, type) {
        $('#formaccount').modal('show');
        if (id != undefined) {
            $http.get(config.api + "accounts/" + id).then(function (response) {
                $scope.myValue = response.data;
                $scope.isAccount = false
            });
        }
        else {
            $scope.myValue = null;
        }
    };
    $scope.itemTableSum = function () {
        var total = 0;
        for (var i = 0; i < $scope.itemTable.length; i++) {
            var product = Number($scope.itemTable[i]);
            total += Number($scope.itemTable[i].amount);
        }
        $scope.totalcharges1 = total.toFixed(2);
        $scope.totalcharges = Number($scope.totalcharges1)
        return $scope.totalcharges;
    }
    
      // remove accountTable line
    $scope.removeAccountLine = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.accountTableSum();
    }
     // edit accountTable 
    $scope.editAccountTable = function (data, index) {
        $scope.idSelectedVote = index;
        $scope.index = index;
        $scope.edit1 = true;
        $scope.accounts = { selected: { accountName: data.accountName } };  
        $scope.accountAmount = data.amount
    }

    $scope.accounts = {}
    $scope.itemAccount = {}
    $scope.accountTable = [];
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
        if ($scope.idSelectedVote != null) {
            $scope.accountTable[$scope.idSelectedVote] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.accountAmount = null;
        $scope.idSelectedVote = null
        $scope.accountTableSum();
       
    }

    // remove itemDetail
    $scope.removeItemDetail = function (index) {
        $scope.itemTable.splice(index, 1);
        $scope.itemTableSum();
    }
    $scope.editItemDetail = function (data, index) {
        $scope.idSelectedVote = index;
        $scope.index = index;
        $scope.edit1 = true;
        $scope.itemAccount = { selected: { accountName: data.accountName } };      
        $scope.itemAmount = data.amount
    }

    $scope.itemTable = [];
    // add itemDetail
    
    console.log($stateParams.no)
    $scope.addItemDetail = function () {
        var accountData = {
            accountName: $scope.itemAccount.selected.accountName,
            accountId: $scope.itemAccount.selected.id,
            description: $scope.itemDescription,
            amount: $scope.itemAmount
        }

        if ($scope.edit1 == true) {
            $scope.itemTable[$scope.index] = accountData;
        } else {
            $scope.itemTable.push(accountData);
        }
        $scope.edit1 = false;
        $scope.itemTableSum();
    }

        // save Expense new 
         $scope.saving = false;
         $scope.saveExpenceNew = function (refNo) {
             var expenseDate = getDate($scope.expenseDate);
             var expenseDueDate = getDate($scope.expenseDueDate);
             if ($scope.supplier.selected == undefined || $scope.supplier.selected == null) {
                 $rootScope.$broadcast('event:error', { message: "Please Select Supplier" });
                 return;
             }
             if (!expenseDate) {
                 $rootScope.$broadcast('event:error', { message: "Invoice date is not valid" });
                 return;
             }
             if (!expenseDueDate) {
                 $rootScope.$broadcast('event:error', { message: "Invoice due date is not valid" });
                 return;
             }

             if (!$scope.expenseId) {
                 $rootScope.$broadcast('event:error', { message: "Please type Invoice No" });
                 return;
             }
             if ($scope.accountTable.length == 0 && $scope.itemTable.length == 0) {
                 $rootScope.$broadcast('event:error', { message: "Please Select Item" });
                 return;
             }

             $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
             var queue = uploader.queue;
             var attachements = [];
             angular.forEach(queue, function (fileItem) {
                 attachements.push({ title: fileItem.title, cdnPath: fileItem.cdnPath, file: fileItem.file })
             });
             if (!$scope.tdsamount) {
                 $scope.netAmount = Math.round(Number($scope.itemTableSum()) + Number($scope.accountTableSum()))
             } else {
                 $scope.netAmount = Math.round(Number($scope.itemTableSum()) + Number($scope.accountTableSum()) - Number($scope.tdsamount))
             }
             var data = {
                 type: "EXPENSE",
                 state: "OPEN",
                 date: expenseDate,
                 amount: $scope.netAmount,
                 compCode: localStorage.CompanyId,
                 role: localStorage['usertype'],
                 refNo: $scope.refNo,
                 no: $scope.expenseId,
                 vochNo: $scope.expenseId,
                 balance: $scope.netamount,
                 narration: $scope.narration,
                 uoVisible: $scope.visible,
                 transactionData: {
                     compCode: localStorage.CompanyId,
                     email:$scope.email,
                     no: $scope.expenseId,
                     expenseId: $scope.expenseId,
                     refNo: $scope.refNo,
                     ordertype: "EXPENSE",
                     supliersId: $scope.supplier.selected.id,
                     id: $scope.id,
                     role: localStorage['usertype'],
                     currency: $scope.currency,
                     date: expenseDate,
                     billDueDate: expenseDueDate,
                     paymentDays: $scope.paymentDays,
                     balance: $scope.netAmount,
                     adminBalance: $scope.netAmount,
                     adminAmount: $scope.netAmount,
                     accountTable: $scope.accountTable,
                     itemTable: $scope.itemTable,
                     amount: $scope.netAmount,
                     tdsamount: $scope.tdsamount,
                     tdsRate: $scope.tdsrate,
                     tdsAccountId: $scope.tdsAccountId,
                     attachements: attachements,
                 }
             }
             $http.post(config.login + "saveExpensetest/" + $stateParams.expenceId + "/"+ $scope.visible, data).then(function (response) {
                 if (response.status == 200) {
                     $rootScope.$broadcast('event:success', { message: "Expense Created" });
                     $stateParams.expenceId = response.data
                     if (refNo) {
                         $state.go('Customer.Expense', { expenceId: null, no: refNo }, { location: 'replace' });
                     } else {
                         $state.go('Customer.Expense', { expenceId: response.data, no: $stateParams.no }, { location: 'replace' });
                     }
                    
                     
                 } else {
                     $rootScope.$broadcast('event:error', { message: "Error while creating Expense" });
                 }
              
        });
    }
        // apply rate to account
         $scope.applyRate = function (rate) {
             if (rate) {
                 var totalTaxableAmount = Number($scope.itemTableSum()) + Number($scope.accountTableSum());
                 var taxOnAmount = (totalTaxableAmount * rate) / 100;
                 $scope.accountAmount = taxOnAmount;
             }
             else
                 $scope.accountAmount = '';
         }

        //calculate tds amount
         $scope.applyTdsRate = function (rate) {
             if (rate) {
                 var totalTaxableAmount = Number($scope.itemTableSum());
                 var tdsOnAmount = (totalTaxableAmount * rate) / 100;
                 $scope.tdsamount = tdsOnAmount
                 $scope.totalAmountTds = Number($scope.itemTableSum()) + Number($scope.accountTableSum())
                 $scope.netTds = Number($scope.totalAmountTds) - Number($scope.tdsamount)
                 $scope.netAmount = $scope.netTds
                 $scope.tdsrate = rate;
                 $scope.tdsAccountId = $scope.tdsRate.selected.id;
             }
             else
                 $scope.tdsamount = '';
         }

         $scope.add = function (type,value) {           
             $('#formaccount').modal('show');
             $scope.myValue = { accountName: value };
             $scope.getSupplier();
             
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
         $(":file").filestyle({ buttonName: "btn-sm btn-info" });
         var type = $stateParams.type;
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