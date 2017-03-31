var myApp = angular
    .module('myApp', ['ui.router', 'datatables','angular-loading-bar', 'anguFixedHeaderTable','ngAnimate',
        //'ngtimeago',
        'oitozero.ngSweetAlert', 'fsm', 'ui.select', 'ngSanitize', 'angular.filter'])
    .config(['$stateProvider','$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {

       $urlRouterProvider.otherwise('/');
        $stateProvider.state("login", {
            url: "/",
            templateUrl: "Account/Login",
            controller: "LoginCntrl"
        })
        $stateProvider.state("Customer", {
            url: "/Customer",
            abstract:true,
            templateUrl: "Customer/Home"
        })
       
        $stateProvider.state("Customer.Customerdetail", {
            url: "/Customerdetail/:cusCode",
            //url: "/RecentOrders",
            templateUrl: "Customer/Customerdetail",
            controller: "CustomerdetailCntrl",
            params: {
                cusCode: null,
                cusName: null
               
        }
        });

        $stateProvider.state("Customer.HomePage", {
            url: "/HomePage",
            //url: "/RecentOrders",
            templateUrl: "Customer/HomePage",
            controller: "LoginCntrl"
        });

        $stateProvider.state("Customer.Customer", {
            url: "/Customer",
            //url: "/RecentOrders",
            templateUrl: "Customer/Customer",
            controller: "CustomerCntrl"
        });


        $stateProvider.state("Customer.Suppliers", {
            url: "/Suppliers/:type",
            templateUrl: "Customer/Suppliers",
            controller: "SupplierCntrl",
            params: {
                type: null
               
            }
            
        });

        $stateProvider.state("Customer.enquirytable", {
            url: "/Supplier/enquirytable",
            templateUrl: "Customer/enquirytable",
            controller: "SupplierCntrl"
            

        });
       

        $stateProvider.state("Customer.SearchTransactions", {
            url: "/SearchTransactions",
            templateUrl: "Customer/SearchTransactions",
            controller: "SearchTransactionsCntrl"
        });

        $stateProvider.state("Customer.Supplierdetail", {
            url: "/Supplierdetail:supCode",
            templateUrl: "Customer/Supplierdetail",
            controller: "SupplierdetailCntrl"
        });

        $stateProvider.state("Customer.Inventory", {
            url: "/Inventory",
            templateUrl: "Customer/Inventory",
            controller: "InventoryCntrl"
    });

        $stateProvider.state("Customer.inventorystock", {
                 url: "/InventoryStock",
                templateUrl: "Customer/inventorystock",
                controller: "inventorystockCntrl"
             });
   
        $stateProvider.state("Customer.Import", {
            url: "/Import",
            templateUrl: "Customer/Import",
            controller: "ImportCntrl"
        });

        $stateProvider.state("Customer.Banking", {
            url: "/Banking",
            templateUrl: "Customer/Banking",
            controller: "BankingCntrl"
        });

        $stateProvider.state("Customer.Sales", {
            url: "/Sales",
            templateUrl: "Customer/Sales",
            controller: "SalesCntrl"


        });


        $stateProvider.state("Customer.Expenses", {
            url: "/Expenses",
            templateUrl: "Customer/Expenses",
            controller: "ExpensesCntrl"


        });


        $stateProvider.state("Customer.Logistics", {
            url: "/Logistics",
            templateUrl: "Customer/Logistics",
            controller: "LogisticsCntrl"


        });

        $stateProvider.state("Customer.Invoice", {
            url: "/Invoice",
            templateUrl: "Customer/Invoice",
            controller: "InvoiceCntrl",
            params: {
                cusCode: null,
                cusName: null

            }

        });

        $stateProvider.state("Customer.ReceivePayment", {
            url: "/ReceivePayment",
            templateUrl: "Customer/ReceivePayment",
            controller: "ReceivePaymentCntrl"

        });

        $stateProvider.state("Customer.Enquiry", {
            url: "/Enquiry/:email/:edit",
            templateUrl: "Customer/Enquiry",
            controller: "EnquiryCntrl",
            params: {
                email: null,
                edit: null
            }

        });

        $stateProvider.state("Customer.PurchaseOrder", {
            url: "/PurchaseOrder/:enqNo/:edit",
            templateUrl: "Customer/PurchaseOrder",
            controller: "PurchaseOrderCntrl",
            params: {
                poNo: null,
                edit: null,
                enqNo:null
            }
        });

        $stateProvider.state("Customer.Bill", {
            url: "/Bill/:billNo/:suppliers",
            templateUrl: "Customer/Bill",
            controller: "BillCntrl",
            params: {
                billNo: null,
                suppliers: null
               
            }

        });

        $stateProvider.state("Customer.Expense", {
            url: "/Expense/:expenceId/:suppliers",
            templateUrl: "Customer/Expense",
            controller: "ExpenseCntrl",
            params: {
                no: null,
                expenceId: null,
                suppliers: null

            }

        });

        $stateProvider.state("Customer.GRNEntry", {
            url: "/GRNEntry",
            templateUrl: "Customer/GRNEntry",
            controller: "GRNEntryCntrl"

        });
              
        
        $stateProvider.state("Customer.AdvancePayment", {
            url: "/AdvancePayment",
            templateUrl: "Customer/AdvancePayment",
            controller: "AdvancePaymentCntrl"

        });
          $stateProvider.state("Customer.SalesInvoice", {
            url: "/SalesInvoice",
            templateUrl: "Customer/SalesInvoice",
            controller: "SalesInvoiceCntrl"

        });
          $stateProvider.state("Customer.SalesInvoicePDF", {
              url: "/SalesInvoicePDF",
              templateUrl: "Customer/SalesInvoicePDF",
              controller: "SalesInvoicePDFCntrl"

          });


          $stateProvider.state("Customer.TaxInvoicePDF", {
              url: "/TaxInvoicePDF",
              templateUrl: "Customer/TaxInvoicePDF",
              controller: "TaxInvoicePDFCntrl"

          });

          $stateProvider.state("Customer.ExciseInvoicePDF", {
              url: "/ExciseInvoicePDF",
              templateUrl: "Customer/ExciseInvoicePDF",
              controller: "ExciseInvoicePDFCntrl"

          });
        $stateProvider.state("Customer.MakePayment", {
            url: "/MakePayment/:voId",
            templateUrl: "Customer/MakePayment",
            controller: "MakePaymentCntrl",
            params: {
                poNo: null,
                suppliers: null,
                Code: null,
                voId: null
               
            }

        });


        $stateProvider.state("Customer.CreateInventory", {
            url: "/CreateInventory",
            templateUrl: "Customer/CreateInventory",


            controller: "CreateInventoryCntrl",
           

         


        });

        $stateProvider.state("Customer.Enquirydetail", {
            url: "/Enquirydetail",
            templateUrl: "Customer/Enquirydetail",
            controller: "EnquirydetailCntrl"

        });
        $stateProvider.state("Customer.PdfView", {
            url: "/PdfView/:po/:enq",
            templateUrl: "Customer/PdfView",
            controller: "PdfViewCntrl",
            params: {
                po: null,
                enq:null

            }
         
           

        });

          $stateProvider.state("Customer.CustomerPdfView", {
            url: "/CustomerPdfView",
            templateUrl: "Customer/CustomerPdfView",
            controller: "CustomerPdfViewCntrl"

        });
          $stateProvider.state("Customer.ChartofAccounts", {
              url: "/ChartofAccounts",
              templateUrl: "Customer/ChartofAccounts",
              controller: "ChartofAccountsCntrl"
          });

          $stateProvider.state("Customer.accountHistory", {
              url: "/accountHistory/:accountName",
              templateUrl: "Customer/accountHistory",
              controller: "accountHistoryCntrl",
              params: {
                  accountName: null,
                  

              }
          });
        // new controller

          $stateProvider.state("Customer.TaxInvoice", {
              url: "/TaxInvoice",
              //url: "/RecentOrders",
              templateUrl: "Customer/TaxInvoice",
              controller: "TaxInvoiceCntrl"
          });


          $stateProvider.state("Customer.BadlaVoucher", {
              url: "/BadlaVoucher",
              templateUrl: "Customer/BadlaVoucher",
              controller: "BadlaVoucherCntrl"
          });

          $stateProvider.state("Customer.GeneralInvoice", {
              url: "/GeneralInvoice",
              templateUrl: "Customer/GeneralInvoice",
              controller: "GeneralInvoiceCntrl"
          });

          $stateProvider.state("Customer.JournalEntry", {
              url: "/JournalEntry",
              templateUrl: "Customer/JournalEntry",
              controller: "JournalEntryCntrl"

          });

          $stateProvider.state("Customer.BalanceInventory", {
              url: "/BalanceInventory",
              templateUrl: "Customer/BalanceInventory",
              controller: "BalanceInventoryCntrl"
          });

          $stateProvider.state("Customer.SalesInvoiceSattlement", {
              url: "/SalesInvoiceSattlement",
              templateUrl: "Customer/SalesInvoiceSattlement",
              controller: "SalesInvoiceSattlementCntrl"
          });

          $stateProvider.state("Customer.PurchaseInvoiceSattlement", {
              url: "/PurchaseInvoiceSattlement",
              templateUrl: "Customer/PurchaseInvoiceSattlement",
              controller: "PurchaseInvoiceSattlementCntrl"
          });

          $stateProvider.state("Customer.BalanceInventoryViewInfo", {
              url: "/BalanceInventoryViewInfo",
              templateUrl: "Customer/BalanceInventoryViewInfo",
              controller: "BalanceInventoryViewInfoCntrl"
             
          });
          $stateProvider.state("Customer.StockBalanceInventory", {
              url: "/StockBalanceInventory",
              templateUrl: "Customer/StockBalanceInventory",
              controller: "StockBalanceInventoryCntrl"

          });

          $stateProvider.state("Customer.VoucherTransactions", {
              url: "/VoucherTransactions",
              templateUrl: "Customer/VoucherTransactions",
              controller: "VoucherTransactionsCntrl"

          });

          $stateProvider.state("Customer.SattlementTransactions", {
              url: "/SattlementTransactions",
              templateUrl: "Customer/SattlementTransactions",
              controller: "SattlementTransactionsCntrl"

          });

          $stateProvider.state("Customer.ForexGainLoss", {
              url: "/ForexGainLoss",
              templateUrl: "Customer/ForexGainLoss",
              controller: "ForexGainLossCntrl"

          });

          $stateProvider.state("Customer.ActivityLog", {
              url: "/ActivityLog",
              templateUrl: "Customer/ActivityLog",
              controller: "ActivityLogCntrl"

          });

          $stateProvider.state("Customer.ExciseInvoice", {
              url: "/ExciseInvoice",
              templateUrl: "Customer/ExciseInvoice",
              controller: "ExciseInvoiceCntrl"

          });



        // Specify HTML5 mode (using the History APIs) or HashBang syntax.
        //$locationProvider.html5Mode(false).hashPrefix('!');
        //$locationProvider.html5Mode(true);
    }]).controller('AppController', ['$rootScope', '$state', function ($rootScope, $state)
    {
        //added here to relive after refersh
        SetCompCode();
        $rootScope.BASE_URL = "";
        function SetCompCode(){
            $rootScope.comp=sessionStorage["CompCode"];
        }
        $rootScope.loggedin = function (comp_code)
        {
            if (comp_code)
                $rootScope.comp = comp_code;
            else
                $rootScope.comp = sessionStorage["CompCode"];
            sessionStorage["CompCode"] = $rootScope.comp;
            $state.go('Customer.HomePage');
        }

    }]);



myApp.value('config', {

login: 'http://localhost:4000/',

api: 'http://localhost:4000/api/'


//login: 'http://bizzy-book-api.azurewebsites.net/',
 //api: 'http://bizzy-book-api.azurewebsites.net/api/'
});


myApp.factory('UserService', function ()
{
    var UserType = 'superadmin';
    return UserType;
})



myApp.service('selectsuppliers', ['$rootScope',
    function ($rootScope) {
            return $rootScope.resource
}
])

myApp.directive('uiTreeSelect', [
  'selectsuppliers',
  '$timeout',
   '$http',
  function (selectsuppliers, $timeout, $http, $rootScope) {
      return {
          
              restrict: 'E',
              scope: { model: '=' },
              link: function (scope, el) {

                  

                  scope.groups = selectsuppliers;

                  console.log(selectsuppliers);
                 
                // scope.groups = selectsuppliers.getSuppliers();

                // scope.groups = data;

                  scope.loadChildGroupsOf = function (group, $select) {
                      $select.search = '';

                     
                      scope.$broadcast('uiSelectFocus');
                  };

                  scope.navigateBackTo = function (crumb, $select) {

                      //    
                      $('#form-popoverPopup').show();

                      /*$select.search = '';
                      var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});
            
                      scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
                      scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
                      $select.open = false;
                      scope.$broadcast('uiSelectFocus');*/
                  };
              },
          templateUrl: '/ui-tree-select.html'
      };
  }
]);

myApp.directive('uiTreeAccount', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
      return {
          restrict: 'E',
          scope: { model: '=' },
          link: function (scope, el) {
              scope.breadcrumbs = [{ "id": 0, "title": "All" }];
              scope.groups = groupFactory.load(2);

              scope.loadChildGroupsOf = function (group, $select) {
                  $select.search = '';

                  scope.breadcrumbs.push(group);
                  scope.groups = groupFactory.load(group.id);
                  scope.$broadcast('uiSelectFocus');
              };

              scope.navigateBackTo = function (crumb, $select) {

             //     $('#form-popoverPopup').show();

                  /*$select.search = '';
                  var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});
        
                  scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
                  scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
                  $select.open = false;
                  scope.$broadcast('uiSelectFocus');*/
              };
          },
          templateUrl: '/ui-tree-Account.html'
      };
  }
]);

myApp.directive('uiTreeItem', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
      return {
          restrict: 'E',
          scope: { model: '=' },
          link: function (scope, el) {
              scope.breadcrumbs = [{ "id": 0, "title": "All" }];




              scope.groups = groupFactory.load(2);

              scope.loadChildGroupsOf = function (group, $select) {
                  $select.search = '';

                  scope.breadcrumbs.push(group);
                  scope.groups = groupFactory.load(group.id);
                  scope.$broadcast('uiSelectFocus');
              };

              scope.navigateBackTo = function (crumb, $select) {

                  //     $('#form-popoverPopup').show();

                  /*$select.search = '';
                  var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});
        
                  scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
                  scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
                  $select.open = false;
                  scope.$broadcast('uiSelectFocus');*/
              };
          },
          templateUrl: '/ui-tree-Item.html'
      };
  }
]);


  myApp.factory('myService', function ($http) {
      var url = "http://bizzy-book-api.azurewebsites.net/api/"
      var http = {
          postSuppliers: function (webService, data) {
              var promise = $http.post(url + webService, data).then(function (response) {
                  return response.data;
              });     
              return promise;
          },
          getSuppliers: function () {
          var promise = $http.get(url+"suppliers").then(function (response) {
              return response.data;
          });
          return promise;
      }
      };
      return http;
  });


 

myApp.directive('uiTreeInvoice', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
      return {
          restrict: 'E',
          scope: { model: '=' },
          link: function (scope, el) {
              scope.breadcrumbs = [{ "id": 0, "title": "All" }];
              scope.groups = groupFactory.load(3);

              scope.loadChildGroupsOf = function (group, $select) {
                  $select.search = '';

                  scope.breadcrumbs.push(group);
                  scope.groups = groupFactory.load(group.id);
                  scope.$broadcast('uiSelectFocus');
              };

              scope.navigateBackTo = function (crumb, $select) {

                  //     $('#form-popoverPopup').show();

                  /*$select.search = '';
                  var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});
        
                  scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
                  scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
                  $select.open = false;
                  scope.$broadcast('uiSelectFocus');*/
              };
          },
          templateUrl: '/ui-tree-Invoice.html'
      };
  }
]);

myApp.directive('uiTreeCustomer', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
      return {
          restrict: 'E',
          scope: { model: '=' },
          link: function (scope, el) {
              scope.breadcrumbs = [{ "id": 0, "title": "All" }];
              scope.groups = groupFactory.load(4);

              scope.loadChildGroupsOf = function (group, $select) {
                  $select.search = '';

                  scope.breadcrumbs.push(group);
                  scope.groups = groupFactory.load(group.id);
                  scope.$broadcast('uiSelectFocus');
              };

              scope.navigateBackTo = function (crumb, $select) {

                      $('#form-popoverPopupCustomer').show();

                  /*$select.search = '';
                  var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});
        
                  scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
                  scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
                  $select.open = false;
                  scope.$broadcast('uiSelectFocus');*/
              };
          },
          templateUrl: '/ui-tree-Customer.html'
      };
  }
]);



// Couldn't get on-focus to work, so wrote my own
myApp.directive('uiSelectFocuser', function ($timeout) {
    return {
        restrict: 'A',
        require: '^uiSelect',
        link: function (scope, elem, attrs, uiSelect) {
            scope.$on('uiSelectFocus', function () {
                $timeout(uiSelect.activate);
            });
        }
    };
});
myApp.directive('selectWatcher', function ($timeout) {
    return {
        link: function (scope, element, attr) {
            var last = attr.last;
            if (last === "true") {
                $timeout(function () {
                    $(element).parent().selectpicker('val', 'any');
                    $(element).parent().selectpicker('refresh');
                });
            }
        }
    };
});


myApp.factory('groupFactory', ['$http',
  function ($http) {
    
      var data;

      var data2 = {



          0: [{ "id": 1, "title": "Due on receipt", "size": "57", "parent": true },
              { "id": 2, "title": "Net 15", "size": "67", "parent": true },
              { "id": 3, "title": "Net 30", "size": "32539", "parent": true },
              { "id": 4, "title": "Net 60", "size": "898", "parent": false }],
          1: [{ "id": 1, "title": "Custom Duty", "size": "57", "parent": true },
              { "id": 2, "title": "VAT", "size": "67", "parent": true },
              { "id": 3, "title": "O Tax", "size": "32539", "parent": true },
              { "id": 4, "title": "Tax", "size": "898", "parent": false }],
          2: [{ "id": 1, "title": "Cold rolled stainless steel sheets/plates/coils cut - exstock", "size": "57", "parent": true },
              { "id": 2, "title": "Cold rolled stainless steel defective sheets/plates/coils cut", "size": "67", "parent": true },
              { "id": 3, "title": "Cold rolled stainless steel defective baby coil less than 1 MT coils/sheets.plates cut", "size": "67", "parent": true }],
          3: [{ "id": 1, "title": "Home", "size": "57", "parent": true },
              { "id": 2, "title": "Hours", "size": "57", "parent": true },
              { "id": 3, "title": "Services", "size": "67", "parent": true }],
          4: [{ "id": 1, "title": "Akash", "size": "57", "parent": true },
              { "id": 2, "title": "Pankaj", "size": "57", "parent": true },
              { "id": 3, "title": "Vikas", "size": "67", "parent": true }]
      };

      return {
          load: function () {
              return data;
          }
      }
  }
]);


/*
myApp.run(['$templateCache', function ($templateCache) {
    // Overrides selectize template for group select tree.
    $templateCache.put('selectize/choices.tpl.html', [
      '<div ng-show="$select.open"',
      '  class="ui-select-choices group-tree selectize-dropdown single">',
      '  <div ng-show="true" class="ui-select-breadcrumbs">',
      '    <span class="ui-breadcrumb"',
      '       ng-click="add()">',
      '       + Add New  {{$select.search}}',
      '    </span>',
      '  </div>',
      '  <div class="ui-select-choices-content selectize-dropdown-content">',
      '    <div class="ui-select-choices-group optgroup">',
      '      <div ng-show="$select.isGrouped"',
      '        class="ui-select-choices-group-label optgroup-header">',
      '        {{$group}}',
      '      </div>',
      '      <div class="ui-select-choices-row">',
      '        <div class="option ui-select-choices-row-inner"',
      '           data-selectable="">',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''))

    $templateCache.put("select2/match.tpl.html", 
    "<a ...> ... <span class=\"select2-arrow ui-select-toggle\" ng-click=\"$select.toggle($event)\"><b></b></span></a>");


}]);
*/





