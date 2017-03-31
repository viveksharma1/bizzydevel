myApp.controller('CreateInventoryCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {
    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.goBack = function () {
        window.history.back();
    },
     $scope.popuclose = function () {
         $('#form-popoverPopup').hide();
     },

     $scope.popuclose = function () {
         $('#form-popoverPopup').hide();

     },

     $(".RemoveTR").click(function (event) {
         $(this).closest("tr").remove();
     });
    $scope.test = {};
    console.log($scope.test);
    $scope.accountTable1 = [];
    $scope.edit = function (data, index) {
        $scope.index = index;

        $scope.edit1 = true;
        $scope.test.selected.name = data.name;
        $scope.test1 = data.test;
       

    }
    $scope.addAccount1 = function () {
        if ($scope.edit1 == true) {

            $scope.accountTable1[$scope.index] = { name: $scope.test.selected.name, test: $scope.test1 };
        } else {
            $scope.name = $scope.test.selected.name
            $scope.accountTable1.push({ name: $scope.name, test: $scope.test1 });
            console.log($scope.accountTable1)

        }
       
        
        $scope.edit1 = false;
    }
    $scope.testData = [
          {
           name:"vivek",
         },
         {
             name:"chandAN",
         },
          {
           name:"VIKASH",
          },
        {
           name:"HJFDS",
        }
    ]


   
    $scope.refreshResults = function ($select) {
        var search = $select.search,
          list = angular.copy($select.items),
          FLAG = -1;
        //remove last user input
        list = list.filter(function (item) {
            return item.id !== FLAG;
        });

        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                name: search
            };
            $select.items = [userInputItem].concat(list);
            $select.selected = userInputItem.name
            // $scope.test.selected = userInputItem.description
            $scope.testData.push({ name: $scope.test.selected.name });
            console.log(userInputItem.name)
            console.log($scope.test.selected.name)

            console.log(userInputItem)
        }
    }
   
    $scope.clear= function($event, $select) {
        $event.stopPropagation();
        //to allow empty field, in order to force a selection remove the following line
        $select.selected = undefined;
        //reset search query
        $select.search = undefined;
        //focus and open dropdown
        $select.activate();
    }
   
}]);