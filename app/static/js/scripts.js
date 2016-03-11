var hoverOutTimer = null;
 
jQuery(document).ready(function($) { 
	$(".menulink a").click(function() {
  		$("#navigation").stop(true, true).fadeToggle('fast'); 
	});
	$("a.close").click(function() {
  		$("#navigation").stop(true, true).fadeToggle('fast'); 
	});
	$("a.play").click(function() {
  		$(".video").stop(true, true).fadeToggle('fast');  
	});
	resize_intro(); 
}); 

jQuery(window).load(function(){
	'use strict';
  	$('.flexslider').flexslider({
    	animation: "slide",
   	 	start: function(slider){ 
  		$("#loadingoverlay").stop(true, true).hide(); 
      		$('body').removeClass('loading');
		resize_intro(); 
    	}
  	}); 
}); 

jQuery(window).resize(function () {  
	resize_intro(); 
});

function resize_intro(){
	page_height =  jQuery(window).height(); 
	content_height =  jQuery('#content').height();
 	if(jQuery('#top').height() < (page_height)) { 
	top_margin = (page_height - jQuery('#top').height()) / 2; 
		if(jQuery(window).width() > 770) {   
			jQuery("#top").css('margin-top',(top_margin+15)+'px');  
			jQuery("#top").css('margin-bottom',(top_margin)+'px');  
			jQuery(".flexslider .slides > li").css('height',(content_height)+'px');  
		}
	} else {
		jQuery("#top").css('margin-top','0px');  
		jQuery("#top").css('margin-bottom','0px');  
			jQuery(".flexslider .slides > li").css('height','300px');  	
	}
}
