myApp.controller('JournalEntryCntrl', ['$scope', '$http', '$timeout', '$stateParams', 'commonService', '$rootScope', '$state', 'config', '$filter', function ($scope, $http, $timeout, $stateParams, commonService, $rootScope, $state, config, $filter) {

    $(document).ready(function () {

        /*! Fades in page on load */
        $('body').css('display', 'none');
        $('body').fadeIn(700);

    });
    $scope.goBack = function () {
        window.history.back();
    };
    $('#Journaldt').datepicker();
 
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
    $scope.clear = function ($event, $select) {
        $event.stopPropagation();
        $select.selected = null;
        $select.search = undefined;

        $timeout(function () { $select.activate() }, 300);
    }
    $scope.journalData =[];
    $scope.account = {};
    $http.get(config.api + "accounts").then(function (response) {
        if (response.data) {
            $scope.allAccount = response.data
        }
    })

    function journalDataSum() {
        var credit = 0;
        var debit = 0;
        for (var i = 0; i < $scope.journalData.length; i++) {
            if ($scope.journalData[i].debit) {
                debit += Number($scope.journalData[i].debit);
            }
            if ($scope.journalData[i].credit)
                credit += Number($scope.journalData[i].credit);
        }
        $scope.totalCredit = Number(credit)
        $scope.totalDebit = Number(debit)
    }
    $scope.addItem = function () {
        console.log($scope.credit)
        if ($scope.credit == undefined && $scope.debit == undefined)
        {
            $rootScope.$broadcast('event:error', { message: "Please add amount" });
            return;
        }
        if ($scope.credit && $scope.debit) {
            $rootScope.$broadcast('event:error', { message: "Invalid entry" });
            return;
        }

            var data = {
                accountName: $scope.account.selected.accountName,
                accountId: $scope.account.selected.id,
                description: $scope.description,
                credit: $scope.credit,
                debit: $scope.debit,
            }
            if ($scope.selectedIndex != null) {
                $scope.journalData[$scope.selectedIndex] = data;
            } else {
                $scope.journalData.push(data);
            }
            
            journalDataSum()
            $scope.account = {};
            $scope.description = undefined
            $scope.credit = undefined
            $scope.debit = undefined
        }  
    $scope.selectedAccIndex = null;
    $scope.editJournalTable = function (data, index) {
        if (index === $scope.selectedIndex) {
            $scope.selectedIndex = null;
            $scope.account = null;
            $scope.description = null;
            $scope.credit = null;
            $scope.debit = null
        } else {
            $scope.selectedIndex = index;
            $scope.account = { selected: {accountName:data.accountName} };
            $scope.description = data.description;
            $scope.credit = data.credit;
            $scope.debit = data.debit;
        }
    }
   

    $scope.removeTable = function (index) {
        $scope.journalData.splice(index, 1);
        journalDataSum();
    }

    $scope.savejournal = function () {
        var journaldt = getDate($scope.Journaldt);
        $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
        var data = {
            type: $stateParams.type,
            date: journaldt,
            compCode: localStorage.CompanyId,
            role: localStorage['usertype'],
            no: $scope.no,
            vochNo: $scope.no,
            journalData: $scope.journalData
        }
        $http.post(config.login + "savejournal/" + $stateParams.voId, data).then(function (response) {
            if (response.status == 200) {
                $rootScope.$broadcast('event:success', { message: "Journal Entry created" });
            } else {
                rootScope.$broadcast('event:error', { message: "Error while creating Journal" });
            }
        });
    }

    function getjournal(voId) {
        $http.get(config.api + 'voucherTransactions/' + voId).then(function (response) {
            if (response.data)
            {
                var journalData = response.data
                $scope.no = journalData.no
                $scope.journalData = journalData.journalData
                setDate($scope.Journaldt, journalData.date);
                journalDataSum();
            }

            
        })
    }

    $scope.deleteBtn = false
    if ($stateParams.voId) {
        $scope.deleteBtn = true
        getjournal($stateParams.voId);
    }


   
    $scope.deleteVoucherModal = function () {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this Invoice !",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: true
        },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.deleteVoucher();

                    }
                });
    }
    $scope.deleteVoucher = function () {
        $rootScope.$broadcast('event:progress', { message: "Please wait while processing.." });
        $http.get(config.login + "deleteJournalAndContra/" + $stateParams.billNo).then(function (response) {
            if (response.data == "deleted") {
                $rootScope.$broadcast('event:success', { message: "Journal No " + $scope.billNo + " Deleted Succesfully" });
                $stateParams.billNo = null;
                window.history.back();
                $state.reload();
            }
            else {
                $rootScope.$broadcast('event:error', { message: response.data });
            }
        });
    }

}]);