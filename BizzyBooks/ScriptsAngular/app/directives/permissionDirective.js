myApp.directive('permission', ['authService', function (authService) {
    return {
        restrict: 'A',
        //replace: true,
        //scope: {
        //    permission: '='
        //}//,
        link: function (scope, elem, attrs) {
            scope.$watch(authService.isLoggedIn, function () {
                //console.log(elem.attr("permission"));
                if (authService.userHasPermission(elem.attr("permission"))) {
                    elem.show();
                } else {
                    elem.hide();
                }
            });
        }
    }
}]);