myApp.controller('ChartofAccountsCntrl', ['$scope', '$http', 'config', 'dateService', function ($scope, $http, config, dateService) {
    
    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $.fn.datepicker.defaults.format = "dd/mm/yyyy";

    $scope.userType = localStorage.usertype
    $('#fromDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $('#toDate').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });

    $scope.Accountbtn = function (id) {

        console.log(id);

        $('#formaccount').modal('show');
        if (id != undefined) {
            $http.get(config.api + "accounts/" + id).then(function (response) {
                console.log(response);
                $scope.myValue = response.data;
                $scope.isAccount = false
            });
        }
        else {
            $scope.myValue = null;
        }
       
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
    $(".js-example-basic-single").select2();
    //console.log(localStorage.DefaultCompanyName);



    $('.btn-toggle').click(function () {
        $(this).find('.btn').toggleClass('active');

        if ($(this).find('.btn-primary').size() > 0) {
            $(this).find('.btn').toggleClass('btn-primary');
        }
        if ($(this).find('.btn-danger').size() > 0) {
            $(this).find('.btn').toggleClass('btn-danger');
        }
        if ($(this).find('.btn-success').size() > 0) {
            $(this).find('.btn').toggleClass('btn-success');
        }
        if ($(this).find('.btn-info').size() > 0) {
            $(this).find('.btn').toggleClass('btn-info');
        }

        $(this).find('.btn').toggleClass('btn-default');

    });
    //$http.get(config.login + "chartOfAccount/" + localStorage.CompanyId).then(function (response) {
    //    $scope.account = response.data;
    //    console.log($scope.account);
    //});




    //add group popup
   
    $scope.add = function () {

        $('#newGroupModal').modal('show');

    }
    $scope.popuclose = function () {
        $('#form-popoverPopup').hide();
    }


    $scope.dateFormat = function (date) {
        var res = date.split("/");
        console.log(res);
        var month = res[1];
        var days = res[0]
        var year = res[2]
        var date = month + '/' + days + '/' + year;
        return date;
    }
    
    $scope.searchAccount = function (fromDate,toDate) {
        var fromDate = $scope.dateFormat(fromDate)
        var toDate = $scope.dateFormat(toDate)
            $http.get(config.login + "dateWiseAccountDetail/" + localStorage.CompanyId + "?date=" + toDate).then(function (response) {
                $scope.account = response.data;
                console.log($scope.account);
            });
        }
    
    "get account Data with opening balance"

    function getAccountData(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].openingBalanceVisible == true && localStorage.usertype == 'UO') {
                data[i].balance = data[i].openingBalance + data[i].credit - data[i].debit
            }
            else if ((data.openingBalanceVisible == false || data.openingBalanceVisible == undefined) && localStorage.usertype == 'UO') {
                data[i].balance = data[i].credit - data[i].debit
            }
            else {
                if ( data[i].balanceType == 'credit') {
                    data[i].balance = data[i].credit - data[i].debit
                } else if (data[i].balanceType == 'debit') {
                    data[i].balance =  data[i].credit - data[i].debit
                }
            }
        }
        return data;
    }

    $scope.$on('scanner-started', function (event, args) {
        $scope.fdate = args.fromDate.fdate;
        $scope.tDate = args.toDate.tdate;
        
       $scope.fromDate = $scope.dateFormat($scope.fdate)
       $scope.toDate = $scope.dateFormat($scope.tDate)
       localStorage.fromDate = $scope.fromDate
       localStorage.toDate = $scope.toDate


        $http.get(config.login + "dateWiseAccountDetail/" + localStorage.CompanyId + "?date=" + $scope.toDate).then(function (response) {
            $scope.account = getAccountData(response.data);
            console.log($scope.account);
        });
    });
    $scope.getAccountList = function () {
        $http.get(config.login + "dateWiseAccountDetail/" + localStorage.CompanyId + "?date=" + localStorage.toDate).then(function (response) {
            //$scope.account = response.data;
            $scope.account = getAccountData(response.data);
            console.log($scope.account);
        });
    }
    $scope.getAccountList();
    

    // delete account 

     $scope.deleteAccountPopup = function (id) {
         $scope.accountId = id
         console.log($scope.accountId)
         $("#accountAlert").modal("show");
         
     }

        $scope.deleteAccount = function (id) {
            $http.post(config.login + "deleteAccount/" + $scope.accountId).then(function (response) {
                if (response.data.status == 'success') {
                    showSuccessToast("Account deleted Succesfully");
                    $scope.getAccountList();
                }
                else {
                    showSuccessToast("some internal problem");
                }
            });


        }

    
   
}]);