myApp.controller('EnquiryCntrl', ['$scope', '$http', '$timeout', '$stateParams', '$rootScope', '$state', 'config', function ($scope, $http, $timeout, $stateParams, $rootScope, $state, config) {

localStorage["type1"] = "ENQUIRY"

$("#mySel").select2({

});
   
$(".my a").click(function (e) {
    e.preventDefault();
});

$scope.moreEmployeebtn = function () {
    $('#moreEmployeeModal').modal('show');
},
   
$scope.goBack = function () {
    window.history.back();
},

  
$scope.popuclose = function () {
    $('#form-popoverPopup').hide();
},
     $scope.addInventrybtn = function () {
         $('#addInventryModal').modal('show');
     }



$(".Additem").click(function () {
$('.additemlist').css("display", "block");
var domElement = $('<div class="col-sm-6" style="margin-top:10px"><input type="text" class="form-control" placeholder="" /></div><div class="col-sm-6 " style="margin-top:10px"><input type="text" class="form-control" placeholder="Email address" /></div>');
$('.additemlist').append(domElement);
});

$('.selectpicker').selectpicker();
$scope.sup2 = [];
$scope.suppliersList = function () {
    $scope.sup2 = $('.selectpicker option:selected').val();
    $scope.sup2 = $('.selectpicker option:selected').val();
       

};


$(".RemoveTR").click(function (event) {
    $(this).closest("tr").remove();
});

$('#BillDate').datepicker("setDate", new Date());
$('#billDueDate').datepicker("setDate", new Date());
$('#BillDate').datepicker().on('changeDate', function (ev) {
    $('.datepicker').hide();
});
$('#billDueDate').datepicker().on('changeDate', function (ev) {
    $('.datepicker').hide();
});

var files, res;

document.getElementById("uploadBtn").onchange = function (e) {
    e.preventDefault();

};
document.getElementById('uploadBtn').onchange = uploadOnChange;

function uploadOnChange() {
    var filename = this.value;
    var lastIndex = filename.lastIndexOf("\\");
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    files = $('#uploadBtn')[0].files;
    res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        $("#upload_prev").append("<span>" + files[i].name + "&nbsp;&nbsp;<b>X</b></span>");
    }

}

$(document).on("click", "#upload_prev span", function () {
    res.splice($(this).index(), 1);
    $(this).remove();
        

});

 

$('.Countedit td').click(function () {
    $(this).closest('tr').find('.Count').hide();
    $(this).closest('tr').find('.Count2').show();

});

$('.savetr').click(function () {
    $(this).closest('tr').find('.Count').show();
    $(this).closest('tr').find('.Count2').hide();

});

   
$scope.enqNo = $stateParams.email;
$scope.edit = $stateParams.edit;
   
$scope.billDate = moment().format('MM/DD/YYYY');
$scope.billDueDate = moment().add(1, 'months').format('MM/DD/YYYY');
    

var vm = this;
vm.name = 'World';
vm.tables = [{
    id: 1,
    description: 'Front'
}, {
    id: 2,
    description: 'Back'
}];
vm.drinksList = [{
    id: 1,
    description: 'Cola'
}, {
    id: 2,
    description: 'Water'
}];
vm.order = {};

vm.refreshResults = refreshResults;
vm.clear = clear;

function refreshResults($select) {
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
            description: search
        };
        $select.items = [userInputItem].concat(list);
        $select.selected = userInputItem;
    }
}

function clear($event, $select) {
    $event.stopPropagation();
    //to allow empty field, in order to force a selection remove the following line
    $select.selected = undefined;
    //reset search query
    $select.search = undefined;
    //focus and open dropdown
    $select.activate();
}
   
//get enquiry list for edit enquiry
$scope.supplierList = [];
if ($scope.edit == 1) {

        
    $scope.no = $scope.enqNo;
    $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.enqNo).then(function (response) {

        $scope.enquiryData = response.data;
        $scope.email = response.data[0].email;
        $scope.supplier = response.data[0].supliersName;
        $scope.billDate = moment(response.data[0].date).format('MM/DD/YYYY');
          
        $scope.billDueDate = moment(response.data[0].billDueDate).format('MM/DD/YYYY');
        $scope.no = $scope.enqNo;
        $scope.enquiryTable = response.data[0].itemDetail;
        $scope.supplierList = response.data[0].sentSupplier;
        $scope.supplierList1 = response.data[0].sentSupplier;
        if ($scope.supplierList.length > 2) {
            $("#morebtn").show();
            $scope.totalmore = $scope.supplierList1.length - 2;
        }

        else {
            $("#morebtn").hide();
        }
    });
    
}
else {

             
    $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "ENQUIRY").then(function (response) {

        $scope.enquiryCount = response.data;

        $scope.no = 'ENQ' + $scope.enquiryCount.count;
    });

}


//console.log($scope.cop);

$scope.status1 = "open"
$scope.enquiryTable = [];

//Add row to the enquiry Item detail table

$scope.enquiryTable.push(
        {

            grade: '',
            finish: '',
            thickness: '',
            width: '',
            length: '',
            netweight: '',
            grossweight: '',
            sheetNo: ''
        }
    );

$scope.addRow = function () {
    $scope.enquiryTable.push(
        {
                
            grade: '',
            finish: '',
            thickness: '',
            width: '',
            length: '',
            netweight: '',
            grossweight: '',
            sheetNo: ''
        }
    );
};
  
// Remove the row from item table

$scope.remove = function (index) {

    $scope.enquiryTable.splice(index, 1);
}
    
$scope.removeS = function (index) {
    $scope.totalmore--;
    $scope.supplierList1.splice(index, 1);
}


//get suppliers
//get suppliers
$scope.supplierList = [];
 
   
    

    

//coment by vivek sharma
//coment by vivek sharma
$("#morebtn").hide()
$scope.supplierList1 = [];
var count = 0;
$scope.$watch('sup', function () {

    $http.get(config.api + 'suppliers')
        .success(function (data) {
            $scope.supliers = data;

             

        });
           
    
    if ($scope.sup != undefined) {
        $scope.email = $scope.sup;
            $scope.email1 = $scope.email
            count++;
              
            $scope.supplier = $scope.supplierName
          
             
            $scope.supplierList.push({ "supplier": $scope.supplier, "email": $scope.email1 })

            if (count > 2) {
                $scope.supplierList1.push({ "supplier": $scope.supplier, "email": $scope.email1 })

            }
            else {
               // $scope.supplierList1 = [];

            }           
            if ($scope.supplierList.length > 2) {
                $("#morebtn").show()
              

               
                $scope.totalmore = $scope.supplierList1.length;
            }

            else
                $("#morebtn").hide();

             
        }
           
        
});

// save enquiry

   
$scope.saveEnquiry = function (count) {
    $scope.content = "PO Saved";
    $('#addInventryModal1').modal('show');
    var index = 0;
    $scope.enquiryTable.forEach(function (row) {

    });
       
    var data = {
        compCode: localStorage.CompanyId,
        supliersName: $scope.supplier,
        suplierId: $scope.sup2,
        email: $scope.email,

        currency: $scope.currency,
        date: $scope.billDate,
        billDueDate: $scope.billDueDate,
        no: $scope.no,
        ordertype: "ENQUIRY",
        status: ["OPEN"],
        itemDetail: $scope.enquiryTable,
        sentSupplier: $scope.supplierList
    }

    // edit enquiry 

    // edit enquiry 
    if ($scope.edit == 1) {
        var data = {


            supliersName: $scope.supplier,
            suplierId: $scope.sup2,
            email: $scope.email,
               
            currency: $scope.currency,
            date: $scope.billDate,
            billDueDate: $scope.billDueDate,
            no: $scope.enqNo,
            ordertype: "ENQUIRY",
            status: ["OPEN"],
            itemDetail: $scope.enquiryTable,
            sentSupplier: $scope.supplierList
        }

        $http.post(config.api +"transactions" + "/update" + "?[where][no]=" + $scope.enqNo, data).then(function (response) {

            alert("Enquiry Updated");
        });
    }

           
    else {


          
        console.log($scope.count)

        if ($scope.enquiryTable.length > 0 && $scope.enquiryTable[0].grade !='') {
            $http.post(config.api + "transactions", data).then(function (response) {
                
                $('#addInventryModal1').modal('hide');
                $state.reload();
            });
        }
        else {
            $scope.content = "Please Fill Item Details";
            $('#addInventryModal1').modal('show');
            setTimeout(function () {
                $('#addInventryModal1').modal('show');

            }, 1000);
           // alert("please fill item details")
        }
       
           
    };


       
        
}

   
$scope.add = function () {

    $('#form-popoverPopup').show();


}
 
   
$scope.saveSuppliers = function () {

    var data = {

        company: $scope.suppliersName,
        email: $scope.email1,
        mobile: $scope.mobile

    }

    $http.post(config.api + "suppliers",  data)
    .success(function (data) {
          
    });


}


$scope.openPopup = function()
{
      
alert("please save before view");


}



    
   
}])

