//Javascript for the difficulty selection menu when adding sports

window.onload=function(){
$('.selectpicker').selectpicker();
$('.rm-novice').click(function() {
  $('.remove-example').find('[value=Novice]').remove();
  $('.remove-example').selectpicker('refresh');
});
$('.rm-intermediate').click(function() {
  $('.remove-example').find('[value=Intermediate]').remove();
  $('.remove-example').selectpicker('refresh');
});
$('.rm-expert').click(function() {
  $('.remove-example').find('[value=Expert]').remove();
  $('.remove-example').selectpicker('refresh');
});
$('.ex-disable').click(function() {
    $('.disable-example').prop('disabled',true);
    $('.disable-example').selectpicker('refresh');
});
$('.ex-enable').click(function() {
    $('.disable-example').prop('disabled',false);
    $('.disable-example').selectpicker('refresh');
});

// scrollYou
$('.scrollMe .dropdown-menu').scrollyou();

prettyPrint();
};