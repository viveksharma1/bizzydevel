var orderApp = angular
    .module('orderApp', ['ui.router', 'datatables'])
    .config(['$stateProvider', function ($stateProvider) {
        //$httpProvider.defaults.headers.common['X-Requested-With', 'XMLHttpRequest'];
        // Specify the three simple routes ('/', '/About', and '/Contact')
        //$urlRouterProvider.otherwise('/');
        
        //$stateProvider.state("order.RecentOrders", {
        //    templateUrl: "Order/RecentOrders",
        //    controller: "RecentOrderCntl"
        //});
        //$stateProvider.state("order.OrderHistory", {
        //    templateUrl: "Order/OrderHistory",
        //    controller: "OrderHistoryCntl"
        //});
        //$stateProvider.state("order.OrderView", {
        //    templateUrl: "Order/OrderView",
        //    controller: "OrderViewCntl"
        //});
        // Specify HTML5 mode (using the History APIs) or HashBang syntax.
        //$locationProvider.html5Mode(false).hashPrefix('!');
        //$locationProvider.html5Mode(true);
    }]);