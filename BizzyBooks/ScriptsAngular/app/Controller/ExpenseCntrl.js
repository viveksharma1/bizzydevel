myApp.controller('ExpenseCntrl', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'myService', 'config','$filter',
    function ($scope, $http, $stateParams, $timeout, $rootScope, $state, myService, config, $filter) {
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

        $('#Paymentdate').datepicker("setDate", new Date());

        var files, res;

        document.getElementById("uploadBtn").onchange = function (e) {
            e.preventDefault();

        }
        document.getElementById('uploadBtn').onchange = uploadOnChange;

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

  
        // supplier select box
        $scope.accounts = {};   
        $scope.refNo = $stateParams.no;
  
        $scope.sup = $stateParams.suppliers; 
    
        $scope.accountTable = [];
       

    
   
        $scope.idSelectedVote = null;

        //get supplier data

        $scope.getSupplier = function () {
            $http.get(config.login + "getSupplierAccount/" + localStorage.CompanyId).then(function (response) {
                $scope.supliers = response.data

            });
        }
       
        $scope.getSupplier();


        //calculate total tax and total amount
        var totalTax = function () {
            var total1 = 0;
            for (var i = 0; i < $scope.accountTable.length; i++) {
                var product = Number($scope.accountTable[i]);
                total1 += Number($scope.accountTable[i].amount);
            }
            $scope.taxTotal = total1.toFixed(2);
            $scope.totalTax = Number($scope.subtotalnew) + Number($scope.taxTotal);
            $scope.totalWithTax = $scope.totalTax.toFixed(2)
        }


        //calculate TDS
        $scope.tdsRate = {};
       

        //get account data

    $http.get(config.api + "accounts" ).then(function (response) {
        $scope.account = response.data
       

    })
   
    //create account 
    $scope.createAccount = function () {

        var accountData = {
            compCode: localStorage.CompanyId,
            accountName: $scope.accountName,
            category: '',
            group: $scope.accountgroup,
            type: $scope.accountType,
            balance: $scope.balance,
            credit: 0,
            debit: 0
        }


        $http.post(config.api + "accounts", accountData).then(function (response) {
            $http.get(config.api + "accounts").then(function (response) {
                $scope.account = response.data;
            })
        });

    }


        // bind accountId in account and item table 


    
    $scope.bindAccountId = function (data) {
        var accountData = data;
        for (var i = 0; i < data.length; i++) {
            accountData[i].accountName = localStorage[data[i].accountId]
        }
        return accountData;
    }
    
    //get Expense data
    $scope.supplier = {};

   

    $scope.getExpenseData = function (expenseId) {  
        $http.get(config.api + 'voucherTransactions/'+ expenseId)
                    .then(function (response) {
                        var expenseData = response.data.expenseData;
                        console.log(response)
                        $scope.accountTable = $scope.bindAccountId(expenseData.accountTable);
                        $scope.itemTable = $scope.bindAccountId(expenseData.itemTable);
                        $scope.supplier = { selected: { accountName: localStorage[expenseData.supliersId], id: expenseData.supliersId } };
                        $scope.tdsRate = { selected: { accountName: localStorage[expenseData.tdsAccountId], id: expenseData.tdsAccountId } };
                        $scope.applyTdsRate(expenseData.tdsRate);
                        $scope.expenseDueDate = $filter('date')(expenseData.billDueDate, 'dd/MM/yyyy');
                        $scope.expenseDate = $filter('date')(expenseData.date, 'dd/MM/yyyy');
                        $scope.expenseId = expenseData.expenseId
                        $scope.paymentDays = expenseData.paymentDays
                        $scope.id = response.data.expenseData.id
                        $scope.accountTableSum();
                        $scope.itemTableSum();
                    });
    }

    if ($stateParams.expenceId) {

       
        $scope.supplier = { selected: { company: $stateParams.suppliers } };
        $scope.getExpenseData($stateParams.expenceId)
        
    }
   // $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "EXPENSE").then(function (response) {
     //   $scope.expenseNoCount = response.data.count;
      //  $scope.expenseId = "EXPENSE" + response.data.count;

    ///})
        // calculate sum of Item table and acoount table

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
    //add acount 

    $scope.removeAccountLine = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.accountTableSum();
    }

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
        var accountData = {
            accountName: $scope.accounts.selected.accountName,
            accountId: $scope.accounts.selected.id,
            description: $scope.accountDescription,
            amount: $scope.accountAmount
        }

        if ($scope.edit1 == true) {
            $scope.accountTable[$scope.index] = accountData;
        } else {
            $scope.accountTable.push(accountData);
        }
        $scope.edit1 = false;
        $scope.accountTableSum();
    }


    $scope.refreshAccountTable = function ($select) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
            $select.selected = userInputItem.name
            // $scope.account.push({ accountName: $scope.accounts.selected.accountName });

        }
    }


    // add line Item
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


    $scope.refreshAccountTable = function ($select) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });
        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
            $select.selected = userInputItem.name
            // $scope.account.push({ accountName: $scope.accounts.selected.accountName });

        }
    }
    $scope.saveAndClose = function () {
        $scope.saveExpense();
        $scope.goBack();
    }
   
    $scope.paymentTerm = function () {
        $scope.expenseDueDate = moment($scope.expenseDate, "DD/MM/YYYY").add($scope.paymentDays, 'days').format('DD/MM/YYYY');
    }
    $('#expenseDate').datepicker();

         $scope.dateFormat = function (date) {
          var res = date.split("/");
         
          var month = res[1];
          var days = res[0]
          var year = res[2]
          var date = month + '/' + days + '/' + year;
          return date;
      }
    // save Expense new 
         $scope.saveExpenceNew = function () {

             if (!$scope.tdsamount) {
                 $scope.netAmount = Number($scope.itemTableSum()) + Number($scope.accountTableSum())
             } else {
                 $scope.netAmount = Number($scope.itemTableSum()) + Number($scope.accountTableSum())- Number($scope.tdsamount)
             }

        //     if ($scope.tdsRate == undefined) {
        //         $scope.tdsAccountId = null;
        //         $scope.tdsrate = null;
        //     }
        //     else {
        //         $scope.tdsAccountId = $scope.tdsRate.selected.id;
        //         $scope.tdsrate = $scope.tdsRate.selected.rate;
        //     }
        //if ($scope.totalcharges && $scope.TDS && $scope.totaltax) {
        //    $scope.netamount = Number($scope.netTds) + Number($scope.totaltax);
        //}
        //else {
        //    if ($scope.totalcharges && $scope.totaltax) {
               
        //        $scope.netamount = Number($scope.totalcharges) + Number($scope.totaltax);
        //    }
        //    else {
        //        if ($scope.totalcharges && $scope.TDS) {
        //            $scope.netamount = $scope.netTds
        //        }
        //        else {
                    
        //            if ($scope.totalcharges) {
                       
        //                $scope.netamount = Number($scope.totalcharges);
        //            } else {
        //                $scope.netamount = Number($scope.totaltax);
        //            }
        //        }
        //    }
             //}

             var data = {
                 type: "EXPENSE",
                 state: "OPEN",
                 date: $scope.dateFormat($scope.expenseDate),
                 amount: $scope.netAmount,
                 compCode: localStorage.CompanyId,
                 role: localStorage['usertype'],
                 refNo: $stateParams.no,
                 no: $scope.expenseId,
                 vochNo:$scope.expenseId,
                 expenseData: {
                     compCode: localStorage.CompanyId,
                     no: $scope.expenseId,
                     expenseId: $scope.expenseId,
                     refNo: $stateParams.no,
                     ordertype: "EXPENSE",
                     supliersId: $scope.supplier.selected.id,
                     id: $scope.id,
                     role: localStorage['usertype'],
                     currency: $scope.currency,
                     date: $scope.dateFormat($scope.expenseDate),
                     billDueDate: $scope.dateFormat($scope.expenseDueDate),
                     paymentDays: $scope.paymentDays,
                     balance: $scope.netamount,
                     adminBalance: $scope.netamount,
                     adminAmount: $scope.netamount,
                     accountTable: $scope.accountTable,
                     itemTable: $scope.itemTable,
                     amount: $scope.netAmount,
                     tdsamount: $scope.tdsamount,
                     tdsRate: $scope.tdsrate,
                     tdsAccountId: $scope.tdsAccountId
                 }
             }
             $http.post(config.login + "saveExpensetest/" + $stateParams.expenceId, data).then(function (response) {
            showSuccessToast("Expense Save Succesfully");
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
    
}]);