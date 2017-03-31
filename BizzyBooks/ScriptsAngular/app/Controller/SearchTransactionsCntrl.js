myApp.controller('SearchTransactionsCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

  

    $('#DatefilterDiv').hide();

    $('#DateFilter').click(function (e) {
        $('#DatefilterDiv').toggle();
    });

  

    $('#DatefilterFrom').datepicker();

    $('#DatefilterTo').datepicker();

      //$('html').click(function () {
      //    $('#DatefilterDiv').hide();

    //});
    $('#SearchFilterDiv').hide();

    $('.filterClose').click(function () {
        $('#DatefilterDiv').hide();
    });

    $('#SearchFilter').click(function () {
        $('#SearchFilterDiv').show();
    });

    $('.searchfilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")
     

    });

    $('.Referencefilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("" + $(this).text() + "<i class=\"fa fa-sort pull-right\" style=\"margin-top:3px\"></i>")
       

    });

}]);