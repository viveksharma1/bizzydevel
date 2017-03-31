var myApp = angular
    .module('myApp', ['ngRoute', 'datatables', 'ui.select', 'ngSanitize'])
    .config(['$routeProvider', function ($routeProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With', 'XMLHttpRequest'];
        // Specify the three simple routes ('/', '/About', and '/Contact')
        $routeProvider.when('/', {
            templateUrl: '../Customer/Customer',
            controller: 'CustomerCntrl',
        });
        //$routeProvider.when('/RecentOrders', {
        //    templateUrl: '/Order/RecentOrders',
        //    controller: 'RecentOrderCntl',

        //});
        $routeProvider.state('/Customer', {
            templateUrl: 'Customer/HomePage',
            controller: 'HomePageCntrl'
        });
        $routeProvider.state('/Customer', {
            templateUrl: 'Customer/Customer',
            controller: 'CustomerCntrl'
        });
        $routeProvider.state('/Customerdetail', {
            templateUrl: 'Customer/Customerdetail',
            controller: 'CustomerdetailCntrl'
        });

        $routeProvider.state('/SearchTransactions', {
            templateUrl: 'Customer/SearchTransactions',
            controller: 'SearchTransactionsCntrl'
        });

        $routeProvider.state('/Suppliers', {
            templateUrl: 'Customer/Suppliers',
            controller: 'SupplierCntrl'
        });
       

        $routeProvider.state('/Supplierdetail', {
            templateUrl: 'Customer/Supplierdetail',
            controller: 'SupplierdetailCntrl'
        });

        $routeProvider.state('/Inventory', {
            templateUrl: 'Customer/Inventory',
            controller: 'InventoryCntrl'
        });
      
        $routeProvider.state('/Import', {
            templateUrl: 'Customer/Import',
            controller: 'ImportCntrl'
        });

        $routeProvider.state('/Banking', {
            templateUrl: 'Customer/Banking',
            controller: 'BankingCntrl'
        });

        $routeProvider.state('/Sales', {
            templateUrl: 'Customer/Sales',
            controller: 'SalesCntrl'
        });

        $routeProvider.state('/Expenses', {
            templateUrl: 'Customer/Expenses',
            controller: 'ExpensesCntrl'
        });

        $routeProvider.state('/Logistics', {
            templateUrl: 'Customer/Logistics',
            controller: 'LogisticsCntrl'
        });

        $routeProvider.state('/Invoice', {
            templateUrl: 'Customer/Invoice',
            controller: 'InvoiceCntrl'
        });

        $routeProvider.state('/ReceivePayment', {
            templateUrl: 'Customer/ReceivePayment',
            controller: 'ReceivePaymentCntrl'
        });


        $routeProvider.state('/Enquiry', {
            templateUrl: 'Customer/Enquiry',
            controller: 'EnquiryCntrl'
        });

        $routeProvider.state('/PurchaseOrder', {
            templateUrl: 'Customer/PurchaseOrder',
            controller: 'PurchaseOrderCntrl'
        });

        $routeProvider.state('/Bill', {
            templateUrl: 'Customer/Bill',
            controller: 'BillCntrl'
        });

        $routeProvider.state('/Expense', {
            templateUrl: 'Customer/Expense',
            controller: 'ExpenseCntrl'
        });

        $routeProvider.state('/GRNEntry', {
            templateUrl: 'Customer/GRNEntry',
            controller: 'GRNEntryCntrl'
        });

        $routeProvider.state('/AdvancePayment', {
            templateUrl: 'Customer/AdvancePayment',
            controller: 'AdvancePaymentCntrl'
        });

        $routeProvider.state('/MakePayment', {
            templateUrl: 'Customer/MakePayment',
            controller: 'MakePaymentCntrl'
        });


        $routeProvider.state('/CreateInventory', {
            templateUrl: 'Customer/CreateInventory',
            controller: 'CreateInventoryCntrl'
        });

       
        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // Specify HTML5 mode (using the History APIs) or HashBang syntax.
        //$locationProvider.html5Mode(false).hashPrefix('!');
        //$locationProvider.html5Mode(true);
    }]).controller('AppController',['$scope','$rootScope','$location', function ($scope,$rootScope, $location) {
        SetCompCode();
        $rootScope.BASE_URL="";
        $scope.activeView = 'Customer';
        //$("#OrderMenu li").addClass('active');
        //.siblings().removeClass('active');
        //$scope.apply();
        $scope.OpenView=function(view){
            $location.path(view);
            //localStorage.setItem("activeView", view);
            $scope.activeView = view;
        }
        $scope.IsActive=function(view){
            //if(localStorage.getItem("activeView")!=null){
            //    return localStorage.getItem("activeView") == view;
            //} else {
            //    return $scope.activeView == view;
            //}
            return $scope.activeView==view;
        }
        function SetCompCode(){

            $rootScope.comp=sessionStorage["CompCode"];
            //alert($rootScope.comp);
        }
    }]);


////Ui-Select With Add New Section

myApp.directive('uiTreeSelect', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
      return {
          restrict: 'E',
          scope: { model: '=' },
          link: function (scope, el) {
              scope.breadcrumbs = [{ "id": 0, "title": "All" }];
              scope.groups = groupFactory.load(0);

              scope.loadChildGroupsOf = function (group, $select) {
                  $select.search = '';

                  scope.breadcrumbs.push(group);
                  scope.groups = groupFactory.load(group.id);
                  scope.$broadcast('uiSelectFocus');
              };

              scope.navigateBackTo = function (crumb, $select) {

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

myApp.factory('groupFactory', [
  function () {
      var data = {
          0: [{ "id": 1, "title": "Tazzy", "size": "57", "parent": true },
              { "id": 2, "title": "Skimia", "size": "67", "parent": true },
              { "id": 3, "title": "Edgetag", "size": "32539", "parent": true },
              { "id": 4, "title": "Topicware", "size": "898", "parent": false },
              { "id": 5, "title": "Ailane", "size": "83", "parent": false },
              { "id": 6, "title": "Chatterbridge", "size": "084", "parent": false },
              { "id": 7, "title": "Wordtune", "size": "8647", "parent": false },
              { "id": 8, "title": "Demimbu", "size": "2255", "parent": false },
              { "id": 9, "title": "Plajo", "size": "9466", "parent": true },
              { "id": 10, "title": "Skynoodle", "size": "0", "parent": true }],
          1: [{ "id": 21, "title": "Plajo", "size": "1", "parent": true },
              { "id": 22, "title": "Kwilith", "size": "2071", "parent": false },
              { "id": 23, "title": "Mydeo", "size": "306", "parent": false },
              { "id": 24, "title": "Jaxbean", "size": "5", "parent": false },
              { "id": 25, "title": "Photojam", "size": "54", "parent": false }],
          2: [{ "id": 31, "title": "Blogtag", "size": "97084", "parent": false },
              { "id": 32, "title": "Browsetype", "size": "06", "parent": false },
              { "id": 33, "title": "Voonte", "size": "9", "parent": false },
              { "id": 34, "title": "Omba", "size": "71", "parent": false },
              { "id": 35, "title": "Kwilith", "size": "2", "parent": false }],
          3: [{ "id": 41, "title": "Yodo", "size": "2", "parent": false },
              { "id": 42, "title": "Aibox", "size": "2152", "parent": false },
              { "id": 43, "title": "Jetwire", "size": "8858", "parent": false },
              { "id": 44, "title": "Eabox", "size": "5", "parent": false },
              { "id": 45, "title": "Camimbo", "size": "36236", "parent": false }],
          9: [{ "id": 51, "title": "Feedbug", "size": "28933", "parent": false },
              { "id": 52, "title": "Aimbu", "size": "09711", "parent": false },
              { "id": 53, "title": "Avavee", "size": "12", "parent": false },
              { "id": 54, "title": "Eare", "size": "8", "parent": false },
              { "id": 55, "title": "Wikivu", "size": "3", "parent": false }],
          10: [{ "id": 61, "title": "Tagpad", "size": "46", "parent": false },
              { "id": 62, "title": "Kamba", "size": "4", "parent": false },
              { "id": 63, "title": "Eimbee", "size": "26669", "parent": false },
              { "id": 64, "title": "Twitterlist", "size": "95538", "parent": false },
              { "id": 65, "title": "Rhycero", "size": "05", "parent": false }],
          21: [{ "id": 71, "title": "Cogibox", "size": "47", "parent": false },
              { "id": 72, "title": "Dablist", "size": "5", "parent": false }]
      };

      return {
          load: function (id) {
              return data[id];
          }
      }
  }
]);

myApp.run(['$templateCache', function ($templateCache) {
    // Overrides selectize template for group select tree.
    $templateCache.put('selectize/choices.tpl.html', [
      '<div ng-show="$select.open"',
      '  class="ui-select-choices group-tree selectize-dropdown single">',
      '  <div ng-show="true" class="ui-select-breadcrumbs">',
      '    <span class="ui-breadcrumb"',
      '       ng-click="navigateBackTo(crumb, $select)">',
      '       + Add New {{$select.search}}',
      '    </span>',
      '  </div>',
      '  <div class="ui-select-choices-content selectize-dropdown-content">',
      '    <div class="ui-select-choices-group optgroup">',
      '      <div ng-show="$select.isGrouped"',
      '        class="ui-select-choices-group-label optgroup-header cursor">',
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
}]);
