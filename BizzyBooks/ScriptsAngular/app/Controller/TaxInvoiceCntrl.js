myApp.controller('TaxInvoiceCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {


    $(".my a").click(function (e) {
        e.preventDefault();
    });


    $scope.goBack = function () {
        window.history.back();
    }

    $("#myPopover").popover({
        //  title: '<h3 class="custom-title"><span class="glyphicon glyphicon-info-sign"></span> Popover Info</h3>',
        content: "<table style='width:100%'><tr><th>Date</th><th>Amount Applied</th><th>Payment No.</th></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr><tr><td><a href=''>17/03/2017</a></td><td>Rs500.00</td><td>58</td></tr></table>",
        html: true
    })
    $('#DueDate').datepicker();
    $('#InvoiceDate').datepicker();

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

    $scope.AddLineItem = function () {
        $('#AddLineItemModal').modal('show');
    }
}]);