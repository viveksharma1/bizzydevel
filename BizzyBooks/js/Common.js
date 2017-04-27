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