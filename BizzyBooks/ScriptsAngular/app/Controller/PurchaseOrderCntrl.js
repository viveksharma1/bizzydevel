myApp.controller('PurchaseOrderCntrl', ['$scope', '$http', '$stateParams', '$timeout', 'commonService', '$rootScope', '$state', 'config', 'DTOptionsBuilder', 'DTDefaultOptions', function ($scope, $http, $stateParams, $timeout, commonService,$rootScope, $state, config, DTOptionsBuilder, DTDefaultOptions) {

  
   
    localStorage["type1"] = "PO"


   
    $('#dueDate').hide();
    $(".my a").click(function (e) {
        e.preventDefault();
    });
   
    $scope.goBack = function () {
        window.history.back();
    },


    $scope.popuclose = function () {
        $('#form-popoverPopup').hide();
    },

   

    $('.filenameDiv').hide();
    $('.attechmentDescription').hide();
    $('.Attechmentdetail').click(function () {
        $('.filenameDiv').show();
        $("#type").append($("#typeinput").val());
        $("#name").append($("#NameInput").val());
    });

    $('#removeattachment').click(function () {
        $('.filenameDiv').hide();
    });

$(".Additem").click(function () {
    $('.additemlist').css("display", "block");
    var domElement = $('<div class="col-sm-6" style="margin-top:10px"><input type="text" class="form-control" placeholder="" /></div><div class="col-sm-6 " style="margin-top:10px"><input type="text" class="form-control" placeholder="Email address" /></div>');
    $('.additemlist').append(domElement);
});


$('#BillDate').datepicker("setDate", moment().format('DD/MM/YYYY'));
$('#billDueDate').datepicker("setDate", moment().format('DD/MM/YYYY'));
   
    $scope.poDate = moment().format('DD/MM/YYYY');
    $scope.poDueDate = moment().add(1, 'months').format('MM/DD/YYYY')
    $('#BillDate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });
    $('#billDueDate').datepicker().on('changeDate', function (ev) {
        $('.datepicker').hide();
    });
    $(document).ready(function() {
	$('a[data-confirm]').click(function(ev) {
		var href = $(this).attr('href');
		if (!$('#dataConfirmModal').length) {
			$('body').append('<div id="dataConfirmModal" class="modal" role="dialog" aria-labelledby="dataConfirmLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="dataConfirmLabel">Please Confirm</h3></div><div class="modal-body"></div><div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button><a class="btn btn-primary" id="dataConfirmOK">OK</a></div></div>');
		} 
		$('#dataConfirmModal').find('.modal-body').text($(this).attr('data-confirm'));
		$('#dataConfirmOK').attr('href', href);
		$('#dataConfirmModal').modal({show:true});
		return false;
	});
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
        var files = $(this).get(0).files;
        if (files.length > 0) {
            var formData = new FormData();       
            for (var i = 0; i < files.length; i++) {
                var file = files[i];            
                formData.append('uploads[]', file, $scope.poNo + file.name);
            }
            $.ajax({
                url: config.login +'upload?no=' + $scope.poNo,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log('upload successful!\n' + data);
                }
            });
            $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.poNo).then(function (response) {
                $scope.data = response.data;
                $scope.datapath = $scope.data[0].path;
            });
        }
    };


    // get file path 

    $scope.getfile = function (data) {
        $scope.filepath = data
        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.poNo).then(function (response) {
            $scope.data = response.data;
            $scope.path = $scope.data[0].path;
            $http.get(config.login+'getfile?path=' + $scope.filepath, { responseType: 'arraybuffer' }).then(function (response) {       
                $scope.file = response.data;
                var file = new Blob([$scope.file], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        });
    }

    // delete file

    $scope.deletefile = function (data, index) {
        $scope.datapath.splice(index, 1)
        $http.get(config.login+'delete?path=' + data + '&no=' + $scope.poNo).then(function (response) {
        });
    }

    $(document).on("click", "#upload_prev span", function () {
        res.splice($(this).index(), 1);
        $(this).remove();
        console.log(res);

    });

  
   
    $scope.ExchangeRatebtn = function () {
        $('#ExchangeRateDiv').modal('show');
    },

    $scope.CommodityRatesbtn = function () {
        $('#CommodityRatesDiv').modal('show');
    },

    $('.addexchange').click(function () {
        $('.modalbodyexchange').append('<div class="ExchangeLine"><div class="col-sm-5 padding5"><select class="form-control selectcss">         <option>Indonesian rupiah</option><option>Indian rupee</option></select></div><div class="col-sm-5 padding5"><input type="text" class="form-control" /></div><div class="col-sm-2 padding5 delete"><i class="fa fa-trash"></i> Delete</div></div>');
    });

    $(document).on('click', '.delete', function () {
        $(this).parent('div').remove();
    });

    $('.addcommodity').click(function () {
        $('.modalbodycommodity').append('<div class="ExchangeLine"><div class="col-sm-6 padding5"><select class="form-control selectcss">         <option>Select</option><option>Nickel</option><option>Copper</option><option>Fe</option><option>Molybdenum</option><option>Ferrous</option></select></div><div class="col-sm-6 padding5"><input type="text" class="form-control" /></div></div>');
    });


    $('.Countedit td').click(function () {
        $(this).closest('tr').find('.Count').hide();
        $(this).closest('tr').find('.Count2').show();

    });

    $('.savetr').click(function () {
        $(this).closest('tr').find('.Count').show();
        $(this).closest('tr').find('.Count2').hide();

    });

    $scope.poclose = function () {
        $('#GRNDetailDiv').slideUp();
    }

    $scope.AddAccountTableLine = function () {
        $('#AccountTableLine tr:last').after('<tr class="Countedit"><td class="text-right Count" style="width:50px" data-field="Count">&nbsp;</td><td class="Count" data-field="Account">&nbsp;</td><td class="Count" data-field="Description">&nbsp;</td><td class="text-right Count" data-field="Amount">&nbsp;</td><td class="text-right Count"><a> <i class="fa fa-pencil" style="font-size:16px"></i></a></td><td class="text-right Count2" style="width:50px" data-field="Count"><input type="text" class="form-control" value="4" /></td><td class="Count2" data-field="Account"><ui-tree-Account model="model"></ui-tree-Account></td><td class="Count2" data-field="Description"><input type="text" class="form-control" /></td><td class="text-right Count2" data-field="Amount"><input type="text" class="form-control" /></td><td class="text-right Count2 savetr"><a> <i class="fa fa-save" style="font-size:16px"></i></a></td></tr>');
    },

     $scope.AddTableLine = function () {
         $('#ItemTable tr:last').after('<tr class="Countedit"><td class="Count">&nbsp;</td><td class="Count" style="text-align:center;">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:center">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="Count" style="text-align:right">&nbsp;</td><td class="text-right Count"><a class="edit" title="Edit"> <i class="fa fa-pencil" style="font-size:16px"></i></a></td><td class="Count2"><ui-tree-select model="model"></ui-tree-select></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control" value="" /></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /> </td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /></td><td class="Count2" style="text-align:center;"><input type="text" class="form-control text-center" value="" /></td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /></td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="Count2" style="text-align:right"><input type="text" class="form-control text-right" value="" /> </td><td class="text-right Count2 savetr"><a> <i class="fa fa-save" style="font-size:16px"></i></a></td></tr>');
     }
    //suppliers popup

    $scope.add = function () {

        $('#form-popoverPopup').show();


    }
    $('#example').dataTable({
        "oLanguage": {
            "sProcessing": "DataTables is currently busy"
        }
    });
  
    // Get currency rate

    var access_key = 'af072eeb3d8671688ff6eaa83c8dbcb8';
    var url = 'http://apilayer.net/api/live?access_key=' + access_key;
    var access_key = 'af072eeb3d8671688ff6eaa83c8dbcb8';
    var from = 'USD';
    var to = 'EUR';
    var amount = '1';

    $.ajax({

        url: 'http://apilayer.net/api/convert?access_key=' + access_key,
        success: function (response) {

            if (response.success) {

                alert('1 USD is worth ' + parseFloat(response.rate).toFixed(2) + ' EUR');
            }

            
        }
    });


    

    $scope.data = [];
    
    $http.get(url).then(function (response) {

        $scope.data = response.data;
      
        $('#rs').val(response.data.quotes.USDINR);
        $('#rs1').val(response.data.quotes.USDIDR, 'IDR');

       
        $scope.ExchangeRate1 = response.data.quotes.USDIDR.toFixed(2);
        $scope.ExchangeRate = response.data.quotes.USDINR.toFixed(2);

        $scope.ExchangeRateINR = $scope.ExchangeRate
        $scope.ExchangeRateIDR = $scope.ExchangeRate1


    });

    $scope.currency = $("#currency").val();

    console.log($scope.currency);
    if ($scope.currency == "Rupee") {
        console.log($scope.currency);
        $scope.ExchangeRate = $scope.ExchangeRateINR
    }
    if ($scope.currency == "Rupiah") {
        $scope.ExchangeRate = $scope.ExchangeRateIDR

    }
    
    $scope.saveExchangeRate = function () {

        
        $scope.ExchangeRate = $scope.ExchangeRateINR
        $scope.ExchangeRate1 = $scope.ExchangeRateIDR


    }
   



    
   
    
    
    $scope.rate1="$683.42";
    $scope.rate2 = "$440";
    $scope.rate3="$6833.42";
   


    
    //state params variable

    $scope.no = $stateParams.poNo;
    $scope.edit = $stateParams.edit;
    $scope.enqNo = $stateParams.enqNo;
    console.log($scope.enqNo);

    //get enquiry for edit
   

    if ($scope.edit == 1) {
        $scope.poNo = $scope.enqNo;

        $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.enqNo).then(function (response) {

            localStorage["supplier"] = response.data[0].supliersName;
           
            $scope.supplier = response.data[0].supliersName;

            $scope.email = response.data[0].email;
            $scope.poDate = moment(response.data[0].date).format('MM/DD/YYYY');
          
            $scope.poDueDate = moment(response.data[0].billDueDate).format('MM/DD/YYYY');
            $scope.poNo = $scope.enqNo;
            $scope.poTable = response.data[0].itemDetail;

            if (localStorage['adminrole'] == 2) {

                $scope.subtotalnew = response.data[0].adminAmount;
            }

            if (localStorage['adminrole'] == 3) {

                $scope.subtotalnew = response.data[0].amount;

            }

        });


    }

    else {

        $http.get(config.api + "transactions" + "/count" + "?where[ordertype]=" + "PO").then(function (response) {

            $scope.poCount = response.data.count;
            $scope.poNo = 'PO' + $scope.poCount;
        });

        $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.no).then(function (response) {


            //console.log(response);


            $scope.email = response.data[0].email;
            $scope.supplier = response.data[0].supliersName;
            localStorage["supplier"] = $scope.supplier;
            $scope.ExchangeRate = response.data[0].ExchangeRate;


            $scope.poTable = response.data[0].itemDetail;
        });
    }

    //get selected suppliers
    $scope.$watch('sup', function () {
        $(".sk-wave").show()
        $http.get(config.api + "suppliers" + "?filter[where][compCode]=" + localStorage.CompanyId).then(function (response) {
            $scope.supliers = response.data;
        });

       

        if ($scope.sup != undefined) {

            $http.get(config.api + "suppliers" + "?[filter][where][company]=" + $scope.sup).then(function (response) {
                $scope.email = response.data[0].email;

                console.log(response)
            });

            localStorage["supplier"] = $scope.sup
            $scope.supplier = $scope.sup;
            $http.get(config.api + "transactions" + "?filter[where][ordertype]=" + "ENQUIRY" + "&filter[where][supliersName]=" + $scope.supplier).then(function (response) {

                $scope.enquiryList = response.data;
                if ($scope.enquiryList.length == 0) {
                    $("#noData").show()
                    $scope.noData = "No Enquiry";
                }
                else {
                    $("#noData").hide()



                }
                $(".sk-wave").hide()

            });

        
           
        }

        if ($scope.sup == undefined || $scope.edit != 1) {

            $http.get(config.api + "transactions" + "?filter[where][ordertype]=" + "ENQUIRY" + "&filter[where][supliersName]=" + localStorage["supplier"]).then(function (response) {

                $scope.enquiryList = response.data;
                if ($scope.enquiryList.length == 0) {
                    $("#noData").show()
                    $scope.noData = "No Enquiry";
                }
                else {
                    $("#noData").hide()



                }
                $(".sk-wave").hide()

            });

        }

       
        

       
    });


  
    $scope.menuUp = function (e) {
        $(".statusBody").slideToggle("slow", function () {
            // Animation complete.
        })

        $('#menuUp i').toggleClass("fa-chevron-down fa-chevron-up")
        e.preventDefault();
    };

   
    
    $scope.index = 0;
    var i = 0
    $scope.subtotal = 0;
    var count;
    
    $scope.role;
    $scope.admin = localStorage['adminrole'];
  

    // add item row to  po table 
    $scope.poTable = [];

    $scope.poTable.push(
              {

                  grade: '',
                  finish: '',
                  thickness: '',
                  width: '',
                  length: '',
                  netweight: '',
                  grossweight: '',
                  sheetNo: '',
                  fobunitprice:'',
                  fobRate: '',
                  cif: '',
                  fob:'',
                  charges: ''
              }
        );
    $scope.addrow = function () {
        


      
        if (localStorage['adminrole'] == 1) {

            $scope.poTable.push(
                {

                    grade: '',
                    finish: '',
                    thickness: '',
                    width: '',
                    length: '',
                    netweight: '',
                    grossweight: '',
                    sheetNo: '',
                    fobunitprice: '',
                    fobRate: '',
                    cif: '',
                    fob: '',
                    miscCharge: '',
                    charges: ''
                }
            );
        }
        if (localStorage['adminrole'] == 2) {
          
            $scope.poTable.push(
               {

                   grade: '',
                   finish: '',
                   thickness: '',
                   width: '',
                   length: '',
                   netweight: '',
                   grossweight: '',
                   sheetNo: '',
                   fobunitprice: '',
                   fobRate: '',
                   cif: '',
                   fob: '',
                   charges: ''
               }
           );
        }
        if (localStorage['adminrole'] == 3) {


           
            $scope.poTable.push(
               {

                   grade: '',
                   finish: '',
                   thickness: '',
                   width: '',
                   length: '',
                   netweight: '',
                   grossweight: '',
                   sheetNo: '',
                   fobunitprice: '',
                   fobRate: '',
                   cif: '',
                   fob: '',
                   miscCharge: '',

                   charges: '',
                   adminCharge: ''

               }

           );

           
        }
        // calculating  total amount

        var total = 0;
        for (var i = 0; i < $scope.poTable.length; i++) {
            var product = Number($scope.poTable[i]);
            total += Number($scope.poTable[i].charges);
        }
        $scope.subtotalnew = total;

        // console.log(total);




    }
   

    $scope.addrow1 = function () {
        var total = 0;
        for (var i = 0; i < $scope.poTable.length; i++) {
            var product = Number($scope.poTable[i]);
            total += Number($scope.poTable[i].charges);
        }
        $scope.subtotalnew = total;

        
    }

    // remove po table row 

    $scope.remove = function (index) {

    
        $scope.poTable.splice(index, 1);
        var total = 0;
        for (var i = 0; i < $scope.poTable.length; i++) {
            var product = Number($scope.poTable[i]);
            total += Number($scope.poTable[i].charges);
        }
        $scope.subtotalnew = total;

         
    }
    
    // add enquiry item detail to po item detail

    $scope.addtoPurchase = function (index) {


        $scope.poTable = $scope.enquiryList[index].itemDetail;

        $scope.supplier = $scope.enquiryList[index].supliersName;
       


    }

    //clear row
    $scope.clearTable = function () {

        $scope.poTable = [];

    }

   

    //save suppliers

    $scope.saveSuppliers = function () {

        var data = {

            company: $scope.suppliersName,
            email: $scope.email1,
            mobile: $scope.mobile

        }

        $http.post(config.api + "suppliers", data)
        .success(function (data) {

        });

    }
        // po count 
      
    //get po Lis

       

        //save purchase order

        $scope.savePurchaseOrder = function (index) {
            console.log($scope.poTable);
            $('#addInventryModal1').modal('show');
            
            var total = 0;
            for (var i = 0; i < $scope.poTable.length; i++) {
                var product = Number($scope.poTable[i]);
                total += Number($scope.poTable[i].adminCharge);
            }
            $scope.adminAmount = total;

            var index = 0;

            if ($scope.edit == 1) {
                $scope.poNo = $stateParams.enqNo;
                var data = {

                    supliersName: $scope.supplier,
                    email: $scope.email,
                    role: localStorage['adminrole'],
                    currency: $scope.currency,
                    date: $scope.poDate,
                    billDueDate: $scope.poDueDate,
                    ordertype: "PO",
                    no: $scope.poNo,
                    status: ["OPEN"],
                    itemDetail: $scope.poTable,
                    amount: $scope.subtotalnew,
                    exchangeRate: $scope.ExchangeRate,
                    exchangeRate1: $scope.ExchangeRate1,
                    adminAmount: $scope.adminAmount
                }
                
                $http.post(config.api + "transactions" + "/update" + "?[where][no]=" + $scope.poNo, data).then(function (response) {

                    window.alert(" po  is edited")
                    $state.reload();
                });
            }
            else {
                var data = {

                    compCode: localStorage.CompanyId,
                    supliersName: $scope.supplier,
                    email: $scope.email,
                    role: localStorage['adminrole'],
                    currency: $scope.currency,
                    date: $scope.poDate,
                    billDueDate: $scope.poDueDate,
                    ordertype: "PO",
                    no: $scope.poNo,
                    status: ["OPEN"],
                    itemDetail: $scope.poTable,
                    amount: $scope.subtotalnew,
                    exchangeRate: $scope.ExchangeRate,
                    exchangeRate1: $scope.ExchangeRate1,
                    adminAmount: $scope.adminAmount,
                   
                }
                $http.post(config.api + "transactions", data).then(function (response) {

                    if (response.status == "200" && $scope.no != null) {

                        var data1 = {
                            status: ["CLOSED"]
                        }

                        $http.post(config.api + "transactions" + "/update" + "?[where][no]=" + $scope.no, data1).then(function (response) {

                        })

                        
                    }                           
                  
                    $('#addInventryModal1').modal('hide')
                    $state.reload();
                });
            }


        }


        $scope.view = function (data) {
            $('#GRNDetailDiv').slideDown();

            $scope.EnqNo = data;

            $http.get(config.api + "transactions" + "?filter[where][no]=" + $scope.EnqNo).then(function (response) {
                $scope.itemDetail = response.data[0].itemDetail;
                $scope.suppliersName = response.data[0].supliersName;
                $scope.date = response.data[0].date;
                $scope.no = response.data[0].no;
            });
        }


        $http.get(config.api + "transactions" + "?[filter][where][no]=" + $scope.poNo).then(function (response) {
            if (response.data.length >0) {
                $scope.datapath = response.data[0].path;
                
            }
           

        });


        
            $scope.addInventrybtn = function () {
                $('#addInventryModal').modal('show');
            }
           
            
           

}]);

