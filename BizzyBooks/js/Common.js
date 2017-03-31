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
});