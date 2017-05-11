myApp.service('commonService', function ($http) {
    return {
        getOpeningBalance: function (url, CompanyId) {
            return $http.post(url, CompanyId, function (response) {
                console.log(JSON.stringify(response));
                return response.data;
            });
        }
    };
});