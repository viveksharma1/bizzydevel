myApp.controller('JournalEntryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'myService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, myService, $rootScope, $state, config, $filter) {

    $(document).ready(function () {

        /*! Fades in page on load */
        $('body').css('display', 'none');
        $('body').fadeIn(700);

    });

    $('#Journaldt').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });


    localStorage["type1"] = "BILL"

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },
     $scope.popuclose = function () {
         $('#form-popoverPopup').hide();
     }

    $(document).on("click", "#upload_prev span", function () {
        res.splice($(this).index(), 1);
        $(this).remove();


    });

    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });


    $('#AddCategoryBox').hide();
    $scope.AddCategory = function () {
        $('#AddCategoryBox').show();
    },

    $scope.popuclose = function () {
        $('#AddCategoryBox').hide();
    }

    $('.ProductInformationBox').hide();



    $scope.closeproductInfo = function () {
        $('.ProductInformationBox').hide();

    },


    $scope.addInventrybtn = function () {
        $('#addInventryModal').modal('show');
    },

    $scope.add = function () {
        $('#form-popoverPopup').show();
    };

    $('#Journaldate').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });

    $('.parentaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });

    $('.Incomeaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });

    $('.Expenseaccount > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")


    });


    $scope.addInventry = function () {
        $('#addInventryModal7').modal('show');
    }



    var files, res;

    document.getElementById("uploadBtn").onchange = function (e) {
        e.preventDefault();

    };
    document.getElementById('uploadBtn').onchange = uploadOnChange;





    //file upload
    var doc = new jsPDF();
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
        var files = $(this).get(0).files;
        if (files.length > 0) {

            var formData = new FormData();

            // loop through all the selected files and add them to the formData object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // add the files to formData object for the data payload
                formData.append('uploads[]', file, $scope.billNo + file.name + ".pdf");
            }

            $.ajax({
                url: config.login + 'upload?no=' + $scope.billNo,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log('upload successful!\n' + data);
                }
            });
            $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
                $scope.data = response.data;
                $scope.datapath = $scope.data[0].path;
            });
        }
    };


    // get file path 


    $scope.getfile = function (data) {
        $scope.filepath = data
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            $scope.data = response.data;
            $scope.path = $scope.data[0].path;
            $http.get(config.login + 'getfile?path=' + $scope.filepath, { responseType: 'arraybuffer' }).then(function (response) {
                $scope.file = response.data;
                var file = new Blob([$scope.file], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        });
    }

    // delete file

    $scope.deletefile = function (data, index) {
        $scope.datapath.splice(index, 1)
        $http.get(config.login + 'delete?path=' + data + '&no=' + $scope.billNo).then(function (response) {
        });


    }


    $scope.no = $stateParams.billNo
    $scope.role;
    $scope.admin = localStorage['adminrole'];
    $scope.supplier = {};

    console.log($scope.supplier);


    if ($stateParams.suppliers != null) {
        $scope.supplier = { selected: { company: $stateParams.suppliers } };

    }
    //get Po List

    if ($scope.no != null) {
        $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.no).then(function (response) {
            $scope.polist = response.data;
            $scope.billtable = $scope.polist[0].itemDetail;
            $scope.InventoryList = $scope.polist[0].itemDetail
            $scope.subtotalnew = $scope.polist[0].amount;
            $scope.supplier.selected.email = $scope.polist[0].email;
        });
    }

    // po count 
    $scope.datapath = [];
    $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "BILL").then(function (response) {
        $scope.poCount = response.data.count;
        $scope.billNo = 'BIll' + $scope.poCount;
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.billNo).then(function (response) {
            if (response.data.length > 0) {
                $scope.datapath = response.data[0].path;

            }
        });
    });

    //get suppliers 

    $scope.supliers = []
    $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
        $scope.supliers = response.data;
    });

    //get selected name and email of selected supplier
    /*
      $scope.$watch('supplier.selected', function () {
          if ($scope.supplier.selected.company != undefined) {
              localStorage["supplierBill"] = $scope.supplier;
              $http.get(config.api + 'transactions' + '?filter[where][supliersName]=' + $scope.supplier.selected.company + "&[filter][where][ordertype]=PO")
                    .success(function (data) {
                        $scope.polist = data;
                    });
          }
          else {
              $http.get(config.api + 'transactions' + '?filter[where][supliersName]=' + localStorage["supplierBill"] + "&[filter][where][ordertype]=PO")
                  .success(function (data) {
                      $scope.polist = data;
                  });
          }
      });
      */

    $scope.searchPO = function () {
        $http.get(config.api + 'transactions')
                .success(function (data) {
                    $scope.polist = data;
                });
    }



    //  save bill
    $scope.saveBill = function (index) {

        showSuccessToast("Bill Saved");
        $scope.sumtotal();
        var data = {
            compCode: localStorage.CompanyId,
            supliersName: $scope.supplier.selected.company,
            email: $scope.supplier.selected.email,
            role: localStorage['adminrole'],
            currency: $scope.currency,
            date: $scope.billDate,
            billDueDate: $scope.billDueDate,
            ordertype: "BILL",
            no: $scope.billNo,
            status: ["OPEN"],
            itemDetail: $scope.billtable,
            amount: $scope.subtotalnew.toFixed(2),
            balance: $scope.subtotalnew.toFixed(2),
            ExchangeRate: $scope.ExchangeRateINR,
            supCode: $scope.supplier.selected.supCode
        }
        $http.post(config.api + "transactions", data).then(function (response) {
            $('#addInventryModal1').modal('hide')

            if (response.status == "200") {
                var data = {
                    compCode: localStorage.CompanyId,
                    supCode: $scope.supplier.selected.supCode,
                    supliersName: $scope.supplier.selected.company,
                    accountName: $scope.supplier.selected.company,
                    email: $scope.supplier.selected.email,
                    date: $scope.billDate,
                    particular: 'Inventory',
                    no: $scope.billNo,
                    debit: 0,
                    credit: $scope.subtotalnew.toFixed(2),
                    value: $scope.subtotalnew.toFixed(2),
                    type: 'BILL',
                    lastModified: new Date(),
                    Inventory: {
                        supliersName: $scope.supplier.selected.company,
                        compCode: localStorage.CompanyId,
                        supCode: $scope.supplier.selected.supCode,
                        accountName: 'Inventory',
                        email: $scope.supplier.selected.email,
                        date: $scope.billDate,
                        particular: $scope.supplier.selected.company,
                        no: $scope.billNo,
                        debit: 0,
                        credit: $scope.subtotalnew.toFixed(2),
                        value: $scope.subtotalnew.toFixed(2),
                        type: 'BILL',
                        lastModified: new Date()
                    }
                }
                $http.post(config.login + "transaction", data).then(function (response) {

                });

                var url = config.login + "createInventory";
                $http.post(url, $scope.billtable).success(function (response) {

                })
            }
            if (response.status == "200" && $scope.no != null) {
                var data1 = {
                    status: ["CLOSED"]
                }
                $http.post(config.api + "transactions" + "/update" + "?[where][no]=" + $scope.no, data1).then(function (response) {
                })
            }
        });
    };


    $scope.addEnventory = function () {
        var data = {
            Inventory: $scope.billtable,
            inventoryNo: $scope.billNo,
            supliersName: $scope.supplier,
            date: $scope.billDate
        }


        $http.post(config.api + "Inventories", data).then(function (response) {

        })


    }



    $scope.uploadFile = function () {

        $scope.inventoryLedger = [];
        $scope.rows = [];
        $scope.ExeclDataRows = [];
        $scope.Key = [];
        $scope.KeyArray = [];
        var KeyName1;
        var file = $scope.myFile;
        this.parseExcel = function (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    for (key in XL_row_object) {
                        var retObj = {};

                        for (var obj in XL_row_object[key]) {

                            var obj1 = obj.replace(" ", "");

                            var no = "NO"
                            var date = "date"
                            var exchangeRate = "exchangeRate"

                            if (obj1 == "sheetNo") {
                                retObj[obj1] = Number(XL_row_object[key][obj]);
                            }
                            else {
                                retObj[obj1] = XL_row_object[key][obj];
                            }

                            if (obj1 == "netweight") {
                                retObj[obj1] = Number(XL_row_object[key][obj]);
                                $scope.weight = XL_row_object[key][obj];

                            }
                            else {
                                retObj[obj1] = XL_row_object[key][obj];
                            }
                            if (obj1 == "fobrate") {
                                $scope.rate = XL_row_object[key][obj];

                            }
                            if (obj1 == "cifrate") {
                                $scope.cifrate = XL_row_object[key][obj];

                            }
                            retObj[no] = $scope.billNo;
                            retObj[date] = $scope.billDate;
                            retObj[exchangeRate] = $scope.ExchangeRateINR

                            if ($scope.rate && $scope.weight) {

                                retObj["fobamount"] = Number($scope.rate) * Number($scope.weight);
                            }
                            if ($scope.cifrate && $scope.weight) {
                                retObj["cifamount"] = Number($scope.rate) * Number($scope.weight);

                            }

                            var Keyobj = [];
                            var KeyName = obj;



                            Keyobj[KeyName1] = KeyName;



                            $scope.Key.push(Keyobj);
                        }

                        $scope.ExeclDataRows.push(retObj);
                        $scope.rows = [];
                        $scope.KeyArray = $scope.Key;
                        $scope.Key = [];

                    }
                })
                $scope.billtable = $scope.ExeclDataRows
                $scope.sumtotal();

            };

            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        };
        var data = this.parseExcel(file);
    };

 
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


}]);