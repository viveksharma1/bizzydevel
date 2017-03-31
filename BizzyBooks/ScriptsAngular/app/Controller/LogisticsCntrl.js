myApp.controller('LogisticsCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

    $(".my a").click(function (e) {
        e.preventDefault();
    });

    $scope.NewLogistics = function () {
        $('#NewLogisticsDiv').modal('show');
    },

    $(".Additem").click(function () {
        $('.additemlist').css("display", "block");
        var domElement = $('<div class="col-sm-6" style="margin-top:10px"><input type="text" class="form-control" placeholder="" /></div><div class="col-sm-6 " style="margin-top:10px"><input type="text" class="form-control" placeholder="Email address" /></div>');
        $('.additemlist').append(domElement);
    });

    $('.addexchange').click(function () {
        $('.modalbodyexchange').append('<div class="ExchangeLine"><div class="col-sm-6 padding5"><select class="form-control selectcss">          <option>Upload Docs</option><option>Packing List</option><option>Bill of Ladline</option><option>Form</option></select></div><div class="col-sm-5 padding5"><input type="text" id="txtFileName" class="form-control" placeholder="Upload an EXCEL or CSV file" style="width:132px; margin-right:5px; float:left" /><button type="button" class="btn btn-sm btn-default"><i class="fa fa-upload"></i></button><input type="file" class="uploaded logisticsUpload"  onchange="CopyMe(this, "txtFileName");" /></div><div class="col-sm-1 padding5 delete" style="margin-top:0px"><button type="button" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button></div></div>');
    });


    $(document).on('click', '.delete', function () {
        $(this).parent('div').remove();
    })

    //Get the height of the first item
    $('.Tabmask').css({ 'height': $('#panel-1').height() });

    //Calculate the total width - sum of all sub-panels width
    //Width is generated according to the width of #mask * total of sub-panels
    $('.panelbox').width(parseInt($('.Tabmask').width() * $('.panelbox section').length));

    //Set the sub-panel width according to the #mask width (width of #mask and sub-panel must be same)
    $('.panelbox section').width($('.Tabmask').width());

    //Get all the links with rel as panel
    $('a[rel=panel]').click(function () {

        //Get the height of the sub-panel
        var panelheight = $($(this).attr('href')).height();

        //Set class for the selected item
        $('a[rel=panel]').removeClass('selected');
        $(this).addClass('selected');

        //Resize the height
        $('.Tabmask').animate({ 'height': panelheight }, { queue: false, duration: 1000 });

        //Scroll to the correct panel, the panel id is grabbed from the href attribute of the anchor
        $('.Tabmask').scrollTo($(this).attr('href'), 800);

        //Discard the link default behavior
        return false;
    });


    $('.logisticsfilter > li').click(function () {
        var $toggle = $(this).parent().siblings('.dropdown-toggle');
        $toggle.html("<i class=\"fa fa-tint text-info\"></i>&nbsp;" + $(this).text() + "<i class=\"fa fa-caret-down pull-right\" style=\"margin-top:3px\"></i>")


    });


}]);