$(document).ready(function () {
   

    $('#menutoggle').click(function () {
        $("#wrapper").toggleClass("toggled");
    });


    $('#flyout').hide();
    $('#flyoutCompany').hide();
    $(".addrotate").click(function () {
        $(this).toggleClass("down");
        $('#flyout').fadeToggle("slow", "linear");
    })

    
    function showSuccessToast(message) {

    if (message == undefined)
        message = "Success Dialog which is fading away ...";
    $().toastmessage('showSuccessToast', message);
    }

function showStickySuccessToast(message) {
    $().toastmessage('showToast', {
        text: message,
        sticky: true,
        position: 'top-right',
        type: 'success',
        closeText: '',
        close: function () {
            console.log("toast is closed ...");
        }
    });

}
function showNoticeToast(message) {
    if (message == undefined)
        message = "Notice Dialog which is fading away ...";
    $().toastmessage('showNoticeToast', message);
}
function showStickyNoticeToast(message) {
    $().toastmessage('showToast', {
        text: message,
        sticky: true,
        position: 'top-right',
        type: 'notice',
        closeText: '',
        close: function () { console.log("toast is closed ..."); }
    });
}
function showWarningToast(message) {
    if (message == undefined)
        message = "Warning Dialog which is fading away ...";
    $().toastmessage('showWarningToast', message);
}
function showStickyWarningToast(message) {
    $().toastmessage('showToast', {
        text: message,
        sticky: true,
        position: 'top-right',
        type: 'warning',
        closeText: '',
        close: function () {
            console.log("toast is closed ...");
        }
    });
}
function showErrorToast(message) {
    if (message == undefined)
        message = "Error Dialog which is fading away ...";
    $().toastmessage('showErrorToast', message);
}
function showStickyErrorToast(message) {
    $().toastmessage('showToast', {
        text: message,
        sticky: true,
        position: 'top-right',
        type: 'error',
        closeText: '',
        close: function () {
            console.log("toast is closed ...");
        }
    });
}


    
$('html').on('mouseup', function (e) {
    if (!$(e.target).closest('.popover').length) {
        $('.popover').each(function () {
            $(this.previousSibling).popover('hide');
        });
    }
});

var start = moment().subtract(29, 'days');
var end = moment();
$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
}

$('#reportrange').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
}, cb);

cb(start, end);


    try{
        $(".flexcontainer").style.height = ($(window).height() - ($('.flexheader ').height() + $('.flexfooter ').height())) + "px";
    } catch (e) {
        console.log(e);
    }
});




function setDate(inputDateId, val, inputTimeId) {
    $('#' + inputDateId).datepicker('setDate',val? new Date(val):new Date());
    if (inputTimeId)
        $('#' + inputTimeId).timepicker('setTime', val ? new Date(val) : new Date());


}
function getDate(inputDateId, inputTimeId) {
    var ret = $('#' + inputDateId).datepicker('getDate');
    if (inputTimeId)
        ret = $('#' + inputTimeId).timepicker('getTime', ret);
    return ret;

}
function calculateOpenningBalnce(data, balanceType) {
    return balanceType == 'credit' ? Number(data.credit) - Number(data.debit) : Number(data.debit) - Number(data.credit);
}
var Promise = window.Promise;
if (!Promise) {
    Promise = JSZip.external.Promise;
}
/**
 * Fetch the content and return the associated promise.
 * @param {String} url the url of the content to fetch.
 * @return {Promise} the promise containing the data.
 */
function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('get', url);
        req.responseType = "arraybuffer";
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                try {
                    resolve(req.response);// JSZipUtils._getBinaryFromXHR(xhr);
                } catch (e) {
                    reject(new Error(e));
                }
            }
        };
        req.send();
    });
}
function SweetAlertProcess(message) {
    swal({
        title: "Proccessing!",
        text: message ? message : ".....",
        customClass: 'animated tada',
        imageUrl: "../images/process.gif"
    });
}

function SweetAlertSuccess(message) {
    swal({
        title: "Success!",
        text: message ? message : "Success",
        customClass: 'animated tada',
        imageUrl: "../images/successmsg.png",
        timer:600

    });
}

function SweetAlertError(message) {
    swal({
        title: "Error!",
        text: message ? message : "Please check...",
        customClass: 'animated tada',
        imageUrl: "../images/Cancel.png"
    });
}