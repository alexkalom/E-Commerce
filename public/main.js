function scrollDown(tar) {
  	var target = $(tar);
  	if ($(window).scrollTop() != target.offset().top) {
		$('html, body').animate({
	    	scrollTop: target.offset().top
	    },1000);
	}
}


function animateCart() {
	//$("#shoppingcart-icon").animate({fontSize: "18px"});
	//$("#shoppingcart-icon").animate({fontSize: "14px"});
	$(".shoppingcart").animate({
		width: "400px"
	});
}