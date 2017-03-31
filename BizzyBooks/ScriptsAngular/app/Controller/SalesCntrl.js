myApp.controller('SalesCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {
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

    $scope.transactionData = [];

    $scope.transactionData=[{date:'3/04/2016',type:'SalesReciept',no:'1002',customer:'Ajay Kumar',dueDate:'16/08/2016',balance:'Rs0.00',totalBefore:'Rs500.00',tax:'Rs0.00',total:'Rs500.00',status:'Paid',action:'print'},{date:'3/04/2016',type:'Invoice',no:'1003',customer:'Shankar Subramanian',dueDate:'16/08/2016',balance:'Rs5,000.00',totalBefore:'Rs5,000.00',tax:'Rs0.00',total:'Rs500.00',status:'Open',action:'print'},{date:'15/08/2016',type:'Invoice',no:'1001',customer:'Ajay Kumar',dueDate:'30/07/2016',balance:'Rs1,000.00',totalBefore:'Rs5,000.00',tax:'Rs0.00',total:'Rs5,000.00',status:'Overdue',action:'print'}    ];


}]);