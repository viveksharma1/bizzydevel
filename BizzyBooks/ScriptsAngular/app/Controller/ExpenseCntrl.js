myApp.controller('ExpenseCntrl', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'myService', 'config',
    function ($scope, $http, $stateParams, $timeout, $rootScope, $state, myService, config) {
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
            console.log(res);

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
       

    
   
 

        //get supplier data
        $scope.supliers = []
        $http.get(config.api + "suppliers").then(function (response) {
            $scope.supliers = response.data;
        })
    


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
        $scope.$watch('tdsRate.selected', function () {
           
           
                if ($scope.totaltax == undefined) {
                    $scope.totaltax = 0;
                }
          
                $scope.totalAmountTds = Number($scope.totalcharges) + Number($scope.totaltax)
                $scope.tdsamount = Number($scope.totalAmountTds) * Number($scope.tdsRate.selected.rate) / 100
                $scope.netTds = Number($scope.totalAmountTds) - Number($scope.tdsamount) 

           
        });

        //get account data

    $http.get(config.api + "accounts" ).then(function (response) {
        $scope.account = response.data
        console.log($scope.account);
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

    
    //get Expense data
    $scope.supplier = {};

    console.log($scope.supplier);
    $scope.getExpenseData = function (expenseId) {  
        $http.get(config.api + 'transactions/'+ expenseId)
                    .then(function (response) {
                        console.log(response);                       
                        $scope.accountTable = response.data.accountTable;
                        $scope.itemTable = response.data.itemTable;                     
                        $scope.supplier = { selected: { company: response.data.supliersName } };                       
                        //$scope.invoiceDate = response.data[0].date.format('MM/DD/YYYY');
                        $scope.expenseId = response.data.expenseId
                        $scope.id = response.data.id
                        console.log($scope.id);
                        $scope.accountTableSum();
                        $scope.itemTableSum();
                    });
    }

    if ($stateParams.expenceId) {

        console.log($stateParams.expenceId);
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
    }
    $scope.itemTableSum = function () {
        var total = 0;
        for (var i = 0; i < $scope.itemTable.length; i++) {
            var product = Number($scope.itemTable[i]);
            total += Number($scope.itemTable[i].amount);
        }
        $scope.totalcharges1 = total.toFixed(2);
        $scope.totalcharges = Number($scope.totalcharges1)
    }
    //add acount 

    $scope.removeAccountLine = function (index) {
        $scope.accountTable.splice(index, 1);
        $scope.accountTableSum();
    }

    $scope.editAccountTable = function (data, index) {
        $scope.index = index;
        $scope.edit1 = true;
        $scope.accounts = { selected: { accountName: data.accountName } };
        $scope.accountDescription = data.description
        $scope.amount = data.amount

    }

    $scope.accounts = {}
    $scope.itemAccount = {}
    $scope.accountTable = [];
    $scope.addAccount = function () {
        var accountData = {
            accountName: $scope.accounts.selected.accountName,
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
        $scope.index = index;
        $scope.edit1 = true;
        $scope.itemAccount = { selected: { accountName: data.accountName } };
        $scope.itemDescription = data.description
        $scope.itemAmount = data.amount

    }

    $scope.itemTable = [];
    $scope.addItemDetail = function () {
        var accountData = {
            accountName: $scope.itemAccount.selected.accountName,
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
    $scope.$watch('supplier.selected', function () {
        $scope.shippingAddress = $scope.supplier.selected.billingAddress[0].street
        if ($scope.supplier.selected.email) {
            $scope.email = $scope.supplier.selected.email

        }

    });
    $scope.paymentTerm = function () {
        $scope.expenseDueDate = moment($scope.expenseDate, "DD/MM/YYYY").add($scope.paymentDays, 'days').format('DD/MM/YYYY');
    }
    $('#expenseDate').datepicker();

         $scope.dateFormat = function (date) {
          var res = date.split("/");
          console.log(res);
          var month = res[1];
          var days = res[0]
          var year = res[2]
          var date = month + '/' + days + '/' + year;
          return date;
      }
    // save Expense new 
    $scope.saveExpenceNew = function () {
        if ($scope.totalcharges && $scope.TDS && $scope.totaltax) {
            $scope.netamount = Number($scope.netTds) + Number($scope.totaltax);
        }
        else {
            if ($scope.totalcharges && $scope.totaltax) {
                $scope.netamount = Number($scope.totalcharges) + Number($scope.totaltax);
            }
            else {
                if ($scope.totalcharges && $scope.TDS) {
                    $scope.netamount = $scope.netTds
                }
                else {
                    if ($scope.totalcharges) {
                        $scope.netamount = Number($scope.totalcharges);
                    } else {
                        $scope.netamount = Number($scope.totaltax);
                    }
                }
            }
        }
        var data = {
            compCode: localStorage.CompanyId,
            no: $scope.expenseId,
            expenseId: $scope.expenseId,
            refNo: $stateParams.no,
            ordertype: "EXPENSE",
            supliersName: $scope.supplier.selected.company,
            id:$scope.id,
            role: localStorage['adminrole'],
            currency: $scope.currency, 
            date: $scope.dateFormat($scope.expenseDate),
            billDueDate: $scope.dateFormat($scope.expenseDueDate),
            balance:$scope.netamount,
            adminBalance: $scope.netamount,
            adminAmount:$scope.netamount,

            accountTable: $scope.accountTable,
            itemTable: $scope.itemTable,
            amount: $scope.netamount,
            tdsamount: $scope.tdsamount,
            tdsAccountName:$scope.tdsRate.selected.accountName
        }
        $http.post(config.login + "saveExpense", data).then(function (response) {
            showSuccessToast("Expense Save Succesfully");
        });
    }

    


    
}]);