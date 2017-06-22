myApp.controller('CustomerCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $rootScope, $state, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.menuUp = function (e) {
        $(".statusBody").slideToggle("slow", function () {
            // Animation complete.
        })

        $('#menuUp i').toggleClass("fa-chevron-down fa-chevron-up")
        e.preventDefault();
    };
    $scope.getInvoice = function () {
        $http.get(config.login + 'getInvoiceData/' + localStorage.CompanyId + '?role=' + localStorage["usertype"]).then(function (response) {
            $scope.invoiceData = response.data;
            var totalAmount = 0 
           
            for (var i = 0; i < $scope.invoiceData.length; i++) {
                $scope.invoiceData[i].customer = localStorage[$scope.invoiceData[i].customer];
                totalAmount += $scope.invoiceData[i].amount

            }
            $scope.totalAmount = Number(totalAmount)
        });
    }

   
    $scope.totalCustomerbtn = function () {

        $scope.getCustomer();

        $('#overdueInvoiceTable').hide();
        $('#paidInvoiceTable').hide();
        $('#example').show();
        $('#openInvoiceTable').hide();
    }



   $scope.overDueInvoicebtn = function (status) {

       $('#overdueInvoiceTable').show();
       $('#paidInvoiceTable').hide();
       $('#example').hide();
       $('#openInvoiceTable').hide();
   }

   $scope.paidInvoicebtn = function () {

       $scope.getInvoice();
       $('#overdueInvoiceTable').hide();
       $('#paidInvoiceTable').show();
       $('#example').hide();
       $('#openInvoiceTable').hide();

   }
   
   $scope.openInvoicebtn = function (status) {
       $scope.getInvoice();
       $('#overdueInvoiceTable').hide();
       $('#paidInvoiceTable').hide();
       $('#example').hide();
       $('#openInvoiceTable').show();
       

   }

   
   $scope.openInvoicebtn();
  
   $('#overdueInvoiceTable').hide();
   $('#paidInvoiceTable').hide();

  


   if ($rootScope.$previousState.controller == "SalesInvoiceCntrl") {
       $scope.openInvoicebtn();
   } 

 
   

    


    $('#NewCustomerCreate').click(function () {
        $('#NewCustomerCreateModal').modal('show');

    });

   

    
    $scope.UpdateCustomerInfo = function (id, Name) {
        localStorage.CustomerId = id;
        localStorage.customerName = Name;

    }

    $scope.GetId_Customer = function (id) {
        localStorage.CustomerId_Invoice = id;


    }

   
  

  


    //get customer data
   
   

   

    // get invoice data 
   
    //get customer data

    $scope.getCustomer = function () {
        $http.get(config.login + 'getPartytAccount/' + localStorage.CompanyId).then(function (response) {
            $scope.customerData = response.data;
          
        });
    }



    $('.btnhover button').click(function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active');
    });

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

myApp.directive('salesView', function ($compile, $templateCache) {
    var getTemplate = function () {
        //$templateCache.put('templateId.html', 'This is the content of the template');
        //console.log($templateCache.get("addItem_template.html"));
        return $templateCache.get("salesInfo_template.html");
    }
    return {

        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        scope: {
            billdata: '=',
            exciseData: '='

        },

        controller: ['$scope', '$http', '$rootScope', 'config', '$timeout', function ($scope, $http, $rootScope, config, $timeout) {
            $(".my a").click(function (e) {
                e.preventDefault();
            });
            function getInvoiceData(id) {
                $http.get(config.api + 'voucherTransactions/' + id)
                          .then(function (response) {
                              $scope.invoiceData = response.data;
                              fillCompanyInfo(response.data.compCode);
                              getSupplierDetail(response.data.invoiceData.customerAccountId);
                              getSupplierDetail2(response.data.invoiceData.consigneeAccountId);
                              $scope.gTotal = $scope.invoiceData.amount;
                              $scope.roundOff = $scope.invoiceData.roundOff;
                          });
            }
            $("#TaxInvoice").hide()
            $("#chalan").hide()
            $("#exciseinvoice").hide()
            $scope.getData = function (type) {
                if (type == 'TaxInvoice') {
                    $("#TaxInvoice").show()
                    $("#chalan").hide()
                    $("#exciseinvoice").hide()
                }
                if (type == 'chalan') {
                    $("#TaxInvoice").hide()
                    $("#chalan").show()
                    $("#exciseinvoice").hide()
                }
                if (type == 'exciseinvoice') {
                    $("#TaxInvoice").hide()
                    $("#chalan").hide()
                    $("#exciseinvoice").show()
                }

            }
            $scope.printInvoice = function (printSectionId) {
                var innerContents = document.getElementById(printSectionId).innerHTML;
                var popupWinindow = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                var strScript = '<script type="text/javascript">window.onload=function() {document.getElementById("table").style.whiteSpace = "nowrap"; window.print(); window.close(); };</script>'
                popupWinindow.document.write('<html><head></head><body">' + innerContents + '</body></html>');
                popupWinindow.document.write(strScript);
                popupWinindow.document.close(); // necessary for IE >= 10
            }
            //$scope.totalExciseAmount = 0;
            //$scope.totalSADAmount = 0;

            $scope.$watch('billdata', function () {
               
                getInvoiceData($scope.billdata);
            });

            function fillCompanyInfo(companyId) {
                $http.get(config.api + "CompanyMasters/?filter[where][CompanyId]=" + companyId).then(function (response) {
                    $scope.company = response.data[0];

                });
            }

            function getSupplierDetail(id) {
                $http.get(config.api + "accounts" + "?filter[where][id]=" + id).then(function (response) {
                    $scope.supliersDetail = response.data[0];
                  
                });
            }
            function getSupplierDetail2(id) {
                $http.get(config.api + "accounts" + "?filter[where][id]=" + id).then(function (response) {
                    $scope.supliersDetail2 = response.data[0];
                    
                });
            }

            $scope.$watch('invoiceData.invoiceData.billData', function () {
                var totalQty = 0;
                var totalAmount = 0;
                var totalExciseAmount = 0;
                var totalSADAmount = 0;
                if ($scope.invoiceData && $scope.invoiceData.invoiceData && $scope.invoiceData.invoiceData.billData) {
                    $scope.invoiceData.invoiceData.billData.forEach(function (item) {
                        totalQty += Number(item.itemQty);
                        totalAmount += Number(item.itemAmount);
                        totalExciseAmount += Number(item.dutyPerUnit) 
                        totalSADAmount += Number(item.sadPerUnit) 
                    });
                }
                $scope.totalQty = totalQty;
                $scope.totalAmount = totalAmount;
                $scope.totalExciseAmount = Number(totalExciseAmount.toFixed(2));
                $scope.totalSADAmount = Number(totalSADAmount.toFixed(2));
            }, true);
        }],
        link: function (scope, element, attrs) {
            var popOverContent;
            if (true) {
                //console.log(itemtype)
                var html = getTemplate();
                popOverContent = $compile(html)(scope);
                var options = {
                    content: popOverContent,
                    placement: "middle",
                    html: true,
                    title: scope.title,
                };
                $(element).popover(options);
            }
        }


    };
});