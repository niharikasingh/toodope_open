$(function() {

  $('.modal_button').click(function(e) {
    $('.modal_info').empty();
    $('.modal_info').html('<h4>Thanks!<img src="images/heart.svg" /><img src="images/heart.svg" /><img src="images/heart.svg" /></h4><sub>You\'ll receive an e-mail within 24 hours.');
    var username = $('#userLogin').text();
    $.ajax({
      type:"GET",
      cache:false,
      url:"/fushuAcceptedButton",
      dataType: "json",
      data: {
        username: username,
        message: "Accepted button",
        format: "json"
      },
    });
  });

  $('.open_button').on('click', function(e){
    openModal();
    $('.modal').css("display", "block");
    $('.modal, .modal_overlay').addClass('display');
    $('.open_button').addClass('load');
    var username = $('#userLogin').text();
    $.ajax({
      type:"GET",
      cache:false,
      url:"/fushuOpenButton",
      dataType: "json",
      data: {
        username: username,
        message: "Opened button",
        format: "json"
      },
    });
  });

  $('.modal_close').on('click', function(e){
    $('.modal, .modal_overlay').removeClass('display');
    $('.open_button').removeClass('load');
    e.preventDefault();
    modalClose();
  });

  $('.modal_overlay').click(function() {
    $('.modal_close').click();
  });

  $('.modal').css('display', 'none');

}); // ---- JQUERY COMPLETE

function modalClose(){
  $('.modal').css('display', 'none');
  $(window).off('resize', modalCenter());
}

function modalCenter(){
  $modal = $('.modal');
  $window = $(window);
  var top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
  var left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
  $modal.css({
    top: top + $window.scrollTop(),
    left: left + $window.scrollLeft(),
  });
}

function openModal(){
  $('.modal').css('display', 'block');
  modalCenter();
  $(window).on('resize', modalCenter());
}

// (function(){
//   var $content = $('.modal_info').detach();
//
//   $('.open_button').on('click', function(e){
//     modal.open({
//       content: $content,
//       width: 280//,
//       //height: 300,
//     });
//     $content.addClass('modal_content');
//     $('.modal, .modal_overlay').addClass('display');
//     $('.open_button').addClass('load');
//   });
//
// }());
//
// var modal = (function(){
//
//   var $close = $('<button role="button" class="modal_close" title="Close"><span></span></button>');
//   var $content = $('<div class="modal_content"/>');
//   var $modal = $('<div class="modal"/>');
//   var $window = $(window);
//
//   $modal.append($content, $close);
//
//   $close.on('click', function(e){
//     //$('.modal, .modal_overlay').addClass('conceal');
//     $('.modal, .modal_overlay').removeClass('display');
//     $('.open_button').removeClass('load');
//     e.preventDefault();
//     modal.close();
//   });
//
//   $('.modal_overlay').click(function() {
//     $close.click();
//   });
//
//   return {
//     center: function(){
//       var top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
//       var left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
//       $modal.css({
//         top: top + $window.scrollTop(),
//         left: left + $window.scrollLeft(),
//       });
//     },
//     open: function(settings){
//       $content.empty().append(settings.content);
//
//       $modal.css({
//         width: settings.width || 'auto',
//         height: settings.height || 'auto'
//       }).appendTo('body');
//
//       modal.center();
//       $(window).on('resize', modal.center);
//     },
//     close: function(){
//       $content.empty();
//       $modal.detach();
//       $(window).off('resize', modal.center);
//     }
//   };
// }());
