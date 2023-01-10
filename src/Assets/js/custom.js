/* ========================================== 
 scrollTop() >= 300
 Should be equal the the height of the header
 ========================================== */

$(window).scroll(function () {
    if ($(window).scrollTop() >= 300) {
        $('.site_menu').addClass('fixed-header');
    } else {
        $('.site_menu').removeClass('fixed-header');
    }
});



/*===Back to Top===*/
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.scrollup').show();
    } else {
        $('.scrollup').hide();
    }
});

$('.scrollup').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});

$(function () {
    $(".mob_site_menu").on("click", function () {
        //alert('test');
        $("body").toggleClass("current", 1000);
    });
});

$(document).ready(function () {
    $(".edit_toggle").click(function () {
        $(this).toggleClass("edit_toggle_hide");
        $(".subscription_end_date_edit_calender").toggleClass("highlight");
    });

    $(".subscription_end_date_cancel").click(function () {
        $(".edit_toggle").removeClass("edit_toggle_hide");
        $(".subscription_end_date_edit_calender").removeClass("highlight");
    });



    $(".member_edit").click(function () {
        $('.team_member_action').toggleClass("team_member_action_hide");
        $(".team_member_action_wrapper").toggleClass("show");
    });

    $(".member_edit_cancel").click(function () {
        $(".team_member_action").removeClass("team_member_action_hide");
        $(".team_member_action_wrapper").removeClass("show");
    });

});

$(function () {
    $('.datepicker').daterangepicker({
        //startDate : true,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,

        locale: {
            format: 'YYYY-MM-DD'
        }
    });
});


$(function () {

    var start = moment().subtract(29, 'days');
    var end = moment();

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



//$(".menushow").click(function () {
//    alert('test');
//    //$("body").toggleClass("main");
//});