myApp.controller('ActivityLogCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $rootScope, $state, config) {

    $('#DateFilter').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
    });
    

    $scope.userActivityLog = [];
    $http.get(config.api + "userActivities").then(function (response) {
        if (response.data.length>0) {
            $scope.userActivityLog = response.data
        }
        else {
            showSuccessToast("some internal problem");
        }
    });
    //var urlToChangeStream = "" + config.api + "accounts/change-stream?_format=event-stream";
    //var src = new EventSource(urlToChangeStream);
    //src.addEventListener('data', function (msg) {
    //    var d = JSON.parse(msg.data);
    //    console.log(d)
    //    if (d) {
    //        var username = authService.getAuthentication().username
    //        var activityType;
    //        if (d.type == 'create') {
    //            var activityType = "Account" +" "+ d.data.accountName +" "+ "Created"

    //        } else if(d.type == 'update'){
    //            var activityType = "Account" +" "+ d.data.accountName + " "+"Updated"
    //        }
    //        var logData = {
    //            username: username,
    //            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
    //            activityType:activityType,
    //            vochNo:''

    //        }
    //        $http.post(config.login + "userActivityLog", logData).then(function (response) {
    //            return;
    //        });

    //    }
    //  console.log(d.data);
    //})
}]);