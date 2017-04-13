myApp.controller('ChartofAccountsCntrl', ['$scope', '$http', 'config', function ($scope, $http, config) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });
    $.fn.datepicker.defaults.format = "dd/mm/yyyy";
    $('#fromDate').datepicker();
    $('#toDate').datepicker();
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
    console.log(localStorage.DefaultCompanyName);



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
    $http.get(config.login + "chartOfAccount/" + localStorage.CompanyId).then(function (response) {
        $scope.account = response.data;
        console.log($scope.account);
    });


    //$http.get(config.api + "accounts" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
    //    $scope.parentAccount = response.data;
      
    //});


    //add group popup
   
    $scope.add = function () {

        $('#newGroupModal').modal('show');

    }
    $scope.popuclose = function () {
        $('#form-popoverPopup').hide();
    }


    //$http.get(config.api + "groupMasters").then(function (response) {
    //    $scope.groupMaster = response.data;

    //});
    //$scope.groupMasters = {};
    //$scope.accounts = {};
    //$scope.checkboxModel = {
    //    value1: false

    //};

    //console.log($scope.groupMasters);
    // console.log($scope.groupMasters.selected.name);

    //$scope.isAccount = true;
    //$scope.$watch('groupMasters.selected', function () {
    //    $scope.balanceType = $scope.groupMasters.selected.balanceType;
    //});

    //$scope.createAccountBtn = function () {
    //    $scope.isDisabled = false;
    //    $scope.isAccount = true
    //    $scope.isGroup = false
    //    return false;
    //}
  
    //$scope.createGroupBtn = function () {
        
    //    $scope.isDisabled = true;
    //    $scope.isAccount = false
    //    $scope.isGroup = true
    //    return false;
    //}

    //$scope.createAccount = function () {

    //    if (localStorage['adminrole'] = '3'){
    //        var isUo = true
    //    } if (localStorage['adminrole'] = '2') {
    //        var isUo = false
    //    }
       
    //    console.log($scope.groupMasters);
    //    console.log($scope.checkboxModel.value1);
    //    if ($scope.isAccount) {
    //        //if ($scope.checkboxModel.value1 == "true") {
    //        //    var paranetData = {
    //        //        id: $scope.accounts.selected.id,
    //        //        accountName: $scope.accounts.selected.accountName
    //        //    }
    //        //    var accountData = {
    //        //        compCode: localStorage.CompanyId,
    //        //        accountName: $scope.accountName,
    //        //        isParent: false,
    //        //        parentObj: paranetData,
    //        //        Under: $scope.groupMasters.selected.name,
    //        //        type: $scope.groupMasters.selected.type,
    //        //        balance: $scope.balance,
    //        //        credit: 0,
    //        //        debit: 0,
    //        //        rate: $scope.rate,
    //        //        openingBalance: $scope.openingBalance,
    //        //        balanceType: $scope.groupMasters.selected.balanceType
    //        //    }
    //        //} else {
    //        ////    var accountData = {
    //        ////        compCode: localStorage.CompanyId,
    //        ////        accountName: $scope.accountName.toUpperCase(),
    //        ////        isParent: false,
    //        ////        Under: $scope.groupMasters.selected.name,
    //        ////        type: $scope.groupMasters.selected.type,
    //        ////        balance: $scope.balance,
    //        ////        credit: 0,
    //        ////        debit: 0,
    //        ////        creditUO: 0,
    //        ////        debitUO: 0,
    //        ////        rate: $scope.rate,
    //        ////        isUo: isUo,
    //        ////        rate: $scope.rate,
    //        ////        openingBalance: $scope.openingBalance,
    //        ////        balanceType: $scope.balanceType
                    
    //        //    }
    //        //}
    //        //$http.get(config.api + "accounts/count" + "?[where][accountName]=" + $scope.accountName.toUpperCase()).then(function (response) {
    //        //    if (!response.data.count) {
    //        //        console.log(response.data.count);
    //        //        console.log(response);
    //        //        $http.post(config.api + "accounts", accountData).then(function (response) {

    //        //            $http.post(config.login + "updateAccount", paranetData).then(function (response) {
    //        //            });
    //        //        });
    //        //    }
    //        //    else {

    //        //        alert("AccountName Exist");
    //        //    }
    //        //});
    //        //$http.get(config.login + "chartOfAccount").then(function (response) {
    //        //    $scope.account = response.data;
    //        //});
    //        var accountData = {
    //                   compCode: localStorage.CompanyId,
    //                   accountName: $scope.accountName.toUpperCase(),                     
    //                   Under: $scope.groupMasters.selected.name,
    //                   type: $scope.groupMasters.selected.type,
    //                   balance: $scope.balance,
    //                   credit: 0,
    //                   debit: 0,                    
    //                   rate: $scope.rate,
    //                   isUo: isUo,
    //                   rate: Number($scope.rate),
    //                   openingBalance: $scope.openingBalance,
    //                   balanceType: $scope.balanceType
                    
    //              }
          
    //        $http.post(config.login + "createAccount", accountData).then(function (response) {

    //            $http.get(config.login + "chartOfAccount").then(function (response) {
    //                $scope.account = response.data;
    //            });
    //        });

    //    }
    //    if ($scope.isGroup) {

    //        //var groupData = {
    //        //    compCode: localStorage.CompanyId,              
    //        //    name: $scope.accountName.toUpperCase(),
    //        //    type: $scope.groupMasters.selected.name,
    //        //    balanceType: $scope.balanceType
    //        //}
    //        //$http.get(config.api + "groupMasters/count" + "?[where][name]=" + $scope.accountName.toUpperCase()).then(function (response) {
    //        //    if (!response.data.count) {
    //        //        $http.post(config.api + "groupMasters", groupData).then(function (response) {
    //        //            $http.get(config.api + "groupMasters").then(function (response) {
    //        //                $scope.groupMaster = response.data;
    //        //            });
    //        //        });
    //        //    }
    //        //    else {
    //        //        alert("group exist");
    //        //    }
                    
    //        //});
    //        var groupData = {
    //            compCode: localStorage.CompanyId,
    //            name: $scope.accountName.toUpperCase(),
    //            type: $scope.groupMasters.selected.name,
    //            balanceType: $scope.balanceType
    //        }

    //        $http.post(config.login + "createGroup", groupData).then(function (response) {
    //            $http.get(config.api + "groupMasters").then(function (response) {
    //                $scope.groupMaster = response.data;
    //            });
    //        });
    //    }
    //}
    $scope.dateFormat = function (date) {
        var res = date.split("/");
        console.log(res);
        var month = res[1];
        var days = res[0]
        var year = res[2]
        var date = month + '/' + days + '/' + year;
        return date;
    }

    $scope.searchAccount = function () {
        var toDate = $scope.dateFormat($scope.toDate)
        var fromDate = $scope.dateFormat($scope.fromDate)
        $http.get(config.login + "dateWiseAccountDetail/" + localStorage.CompanyId + "?date=" + toDate).then(function (response) {
            $scope.account = response.data;
            console.log($scope.account);
        });


    }
        


   
}]);