myApp.controller('ImportCntrl', ['$scope', '$http', '$timeout', '$rootScope', '$state', function ($scope, $http, $timeout, $rootScope, $state) {

   
    $scope.goBack = function () {
        window.history.back();
    }

var navListItems = $('ul.setup-panel li a'),
       allWells = $('.setup-content');

allWells.hide();

navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr('href')),
        $item = $(this).closest('li');

    if (!$item.hasClass('disabled')) {
        navListItems.closest('li').removeClass('active');
        $item.addClass('active');
        allWells.hide();
        $target.show();
    }
});

$('ul.setup-panel li.active a').trigger('click');

// DEMO ONLY //
$('#activate-step-2').on('click', function (e) {
    $('ul.setup-panel li:eq(1)').removeClass('disabled');
    $('ul.setup-panel li:eq(0)').addClass('disabled');
    $('ul.setup-panel li a[href="#step-2"]').trigger('click');
   
});

$('#activate-step-3').on('click', function (e) {
    $('ul.setup-panel li:eq(2)').addClass('active').removeClass('disabled');
    $('ul.setup-panel li:eq(1)').addClass('disabled').removeClass('active');
    $('ul.setup-panel li:eq(0)').addClass('disabled');
    $('#step-1').hide();
    $('#step-2').hide();
    $('#step-3').show();
});

$('#Cancel-step-2').on('click', function (e) {
    $('ul.setup-panel li:eq(1)').addClass('disabled').removeClass('active');
    $('ul.setup-panel li:eq(0)').addClass('active');
    $('#step-1').show();
    $('#step-2').hide();
  //  $(this).remove();
});

$('#Cancel-step-3').on('click', function (e) {
    $('ul.setup-panel li:eq(2)').addClass('disabled').removeClass('active');
    $('ul.setup-panel li:eq(1)').addClass('active');
    $('#step-2').show();
    $('#step-3').hide();
    //  $(this).remove();
});




}]);