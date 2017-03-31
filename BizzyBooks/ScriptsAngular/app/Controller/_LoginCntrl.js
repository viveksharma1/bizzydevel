var myApp2 = angular.module('myApp2', [])
.controller('LoginCntrl', ['$scope', '$http', function ($scope, $http) {

  



    $(function () {
        $('#Move').on('click', function () {
            var usernamedetail = $('#usernamedetail').val();
            var userpassword = $('#userpassword').val();
            if (usernamedetail == "") {
                return;

            }
            else if (userpassword == "") {
                return;

            }
            else {
                sessionStorage["CompCode"]=usernamedetail;
                window.location = 'Account/Index';
            }

        });
    });
}]);