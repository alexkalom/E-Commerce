Meteor.subscribe("shop1");
Meteor.subscribe("shop2");
Meteor.subscribe("cart");
Meteor.subscribe("wishlist");
Meteor.subscribe("orders");
Meteor.subscribe("messages");
Meteor.subscribe("tips");
Meteor.subscribe("html");

var TrimLenght = 350;

function setUpSessionCartId() {
	var id = getCookie("cart_id");
	Session.set("cart_id", id);
};

setUpSessionCartId();
Session.set("language", "gr");
Template.navbar.events({
	'click .js-cart-toggle' :function () {
		$(".shoppingcart").animate({
			width: "400px"
		});
	},
	'click .js-lang-toggle' :function () {
		alert("Sorry this feature is not available at the time");
		return;
		if (Session.get("language") == "eng") {
			Session.set("language", "gr");
		}
		else {
			Session.set("language","eng");
		}
	}
});

Template.navbar.helpers({
	isLogged: function () {
		if (Meteor.user()) {
			//user logged in
			if (Session.get("userStatus") != "loggedin") {
				//status changed
				Session.set("userStatus", "loggedin");
				userStatusChanged(); //we need to specify this function
			}
			//otherwise we are all set.
		}
		else {
			//user logged out(guest user)
			if (Session.get("userStatus") != "loggedout") {
				//status changed
				Session.set("userStatus", "loggedout");
				userStatusChanged();
			}
			//otherwise we are all set
		}
	},
	eng : function () {
		if (Session.get("language") == "eng") {
			accountsUIBootstrap3.setLanguage("eng");
			return true;
		}
		else {
			accountsUIBootstrap3.setLanguage("el");
			return false;
		}
	}
});


Template.welcome.events({
	'click .js-shop-click': function () {
		scrollDown("#shop");
	}
});

Template.melia.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	product : function () {
		return Shop1.find({active:true});
	}
});

Template.melia2.onRendered(function() {
	fixProductHeights();
});

Template.kallintika2.onRendered(function() {
	fixProductHeights();
});

Template.melia2.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	product : function () {
		return Shop1.find({active:true});
	},
	tip: function () {
		var date = new Date();
		var month = date.getMonth();
		var tip = Tips.findOne();
		return (Session.get("language") == "eng" ? tip.shop1[month].text_eng : tip.shop1[month].text_gr);
	},
	trim: function (text,id) {
		return trimText(text,TrimLenght,id);
	},
	trimed: function(text,id) {
		if (text.length > TrimLenght) 
			return true;
		return false;
	}
});

Template.kallintika2.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	product : function () {
		return Shop2.find({active:true});
	},
	tip: function () {
		var date = new Date();
		var month = date.getMonth();
		var tip = Tips.findOne();
		return (Session.get("language") == "eng" ? tip.shop2[month].text_eng : tip.shop2[month].text_gr);
	},
	trim: function (text,id) {
		return trimText(text,TrimLenght,id);
	},
	trimed: function(text,id) {
		if (text.length > TrimLenght) 
			return true;
		return false;
	}
});


Template.kallintika.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	product : function () {
		return Shop2.find({});
	}
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	admin:function () {
		if (Meteor.user()) {
			if (Administrators.findOne({userId: Meteor.userId()})) {
				return true;
			}
			else {
				return false;
			}
		}else {
			return false;
		}
	}
});



Template._loginButtonsAdditionalLoggedInDropdownActions.events({
	'click #login-buttons-wishlist' : function (event) {
		event.preventDefault();
		Router.go('/wishlist');
	},
	'click #login-buttons-orders' : function (event) {
		event.preventDefault();
		Router.go("/orders");
	},
	'click #login-buttons-edit-profile' : function (event) {
		event.preventDefault();
		Router.go("/update_profile");
	},
	'click #login-buttons-admin' : function (event) {
		event.preventDefault();
		Router.go("/admin");
	},
});
Template.meliaproduct.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	}
})
Template.meliaproduct.events({
	'click .js-add-to-wishlist' : function () {
		if (Meteor.user()) {
			//the user is logged in
			var wishlist = Wishlist.findOne({user:Meteor.userId()});
			if (wishlist) {
				var products = wishlist.shop1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index < 0) {
					//the product isn't already in the wishlist so we will add it
					products.push({
						_id: this._id
					});
					Meteor.call("updateWishlist", wishlist, wishlist._id);
				}
			}
			else {
				//the wishlist doesn't exist
				var wishlist = {
					user: Meteor.userId(),
					shop1: [{
						_id: this._id
					}],
					shop2: []
				};
				Meteor.call("insertToWishlist", wishlist);
			}
			alert("Product was successfully added to wishlist");
		}
	},
	'click .js-add-to-cart' : function () {
		var quant = $("#add_to_cart_quantiy").val();
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : products,
					cart2: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : products,
					cart2: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();	
	}
});

Template.melia2.events({
	'click .js-read-more': function(event){
		var id =  event.currentTarget.attributes.data.value;
		$("#modal_"+ id).modal("toggle");
	},
	'click .js-add-to-wishlist' : function () {
		if (Meteor.user()) {
			//the user is logged in
			var wishlist = Wishlist.findOne({user:Meteor.userId()});
			if (wishlist) {
				var products = wishlist.shop1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index < 0) {
					//the product isn't already in the wishlist so we will add it
					products.push({
						_id: this._id
					});
					Meteor.call("updateWishlist", wishlist, wishlist._id);
				}
			}
			else {
				//the wishlist doesn't exist
				var wishlist = {
					user: Meteor.userId(),
					shop1: [{
						_id: this._id
					}],
					shop2: []
				};
				Meteor.call("insertToWishlist", wishlist);
			}
			alert("Product was successfully added to wishlist");
		}
	},
	'click .js-add-to-cart' : function () {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : products,
					cart2: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : products,
					cart2: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();	
	}
});


Template.kallintika2.events({
	'click .js-read-more': function(event){
		var id =  event.currentTarget.attributes.data.value;
		$("#modal_"+ id).modal("toggle");
	},
	'click .js-add-to-wishlist' : function () {
		if (Meteor.user()) {
			//the user is logged in
			var wishlist = Wishlist.findOne({user:Meteor.userId()});
			if (wishlist) {
				var products = wishlist.shop2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index < 0) {
					//the product isn't already in the wishlist so we will add it
					products.push({
						_id: this._id
					});
					Meteor.call("updateWishlist", wishlist, wishlist._id);
				}
			}
			else {
				//the wishlist doesn't exist
				var wishlist = {
					user: Meteor.userId(),
					shop2: [{
						_id: this._id
					}],
					shop1: []
				};
				Meteor.call("insertToWishlist", wishlist);
			}
			alert("Product was successfully added to wishlist");
		}
	},
	'click .js-add-to-cart' : function () {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart2 : products,
					cart1: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart2 : products,
					cart1: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();	
	}
});

Template.kallintikaproduct.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	}
});
Template.kallintikaproduct.events({
	'click .js-add-to-wishlist' : function () {
		if (Meteor.user()) {
			//the user is logged in
			var wishlist = Wishlist.findOne({user:Meteor.userId()});
			if (wishlist) {
				var products = wishlist.shop2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index < 0) {
					//the product isn't already in the wishlist so we will add it
					products.push({
						_id: this._id
					});
					Meteor.call("updateWishlist", wishlist, wishlist._id);
				}
			}
			else {
				//the wishlist doesn't exist
				var wishlist = {
					user: Meteor.userId(),
					shop1: [],
					shop2: [{
						_id: this._id
					}]
				};
				Meteor.call("insertToWishlist", wishlist);
			}
			alert("Product was successfully added to wishlist");
		}
	},
	'click .js-add-to-cart' : function () {
		var quant = $("#add_to_cart_quantiy").val();
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : [],
					cart2: products,
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : [],
					cart2: products,
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();
	}
});

Template.shoppingcart.events({
	'click .js-close-cart' : function (){
		$(".shoppingcart").animate({
			width: "0px"
		});
	},
	'click .js-remove-item-from-cart1' : function (event) {
		var cart,id;
		if (Meteor.user()) {
			cart = Cart.findOne({user:Meteor.userId()});
		}
		else {
			id = Session.get("cart_id");
			//no check is neccessary
			cart = Cart.findOne({_id: id});
		}
		var products = cart.cart1;
		var context = this;
		var index = products.findIndex(function (p) {
				return p._id == context._id
			});
		products.splice(index,1);		
		//update the cookie
		var d = new Date();
		if (!Meteor.user()) {
			setCookie("cart_id", id, d, 5);
		}
		//now update the accessedOn of the cart
		cart.accessedOn = d;
		//update the the cart object to the database
		Meteor.call("updateCart", cart, cart._id);
	},
	'click .js-remove-item-from-cart2' : function (event) {
		var cart,id;
		if (Meteor.user()) {
			cart = Cart.findOne({user:Meteor.userId()});
		}
		else {
			id = Session.get("cart_id");
			//no check is neccessary
			cart = Cart.findOne({_id: id});
		}
		var products = cart.cart2;
		var context = this;
		var index = products.findIndex(function (p) {
				return p._id == context._id
			});
		products.splice(index,1);		
		//update the cookie
		var d = new Date();
		if (!Meteor.user()) {
			setCookie("cart_id", id, d, 5);
		}
		//now update the accessedOn of the cart
		cart.accessedOn = d;
		//update the the cart object to the database
		Meteor.call("updateCart", cart, cart._id);
	},
	'click .js-shoppingcart-view-cart' : function (event) {
		event.preventDefault();
		Router.go("/cart");
		$(".shoppingcart").animate({
			width: "0px"
		});
	}
});

Template.shoppingcart.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	meliaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart){
				return cart.cart1;
			}
			else {return undefined;}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart1;
			}
			else {return undefined;}
		}
	},
	meliaproduct_details : function (_id){
		return Shop1.findOne({_id: _id});
	},
	kallintikaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				return cart.cart2;
			}else {
				return undefined;
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart2;
			}
			else {return undefined;}
		}
	},
	kallintikaproduct_details : function (_id){
		return Shop2.findOne({_id: _id});
	},
	NUM_OF_ITEMS: function () {
		var items = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
			}
		}
		return items;
	},
	TOTAL_PRICE: function () {
		var price = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		return price;
	}
});


Template.cart.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	meliaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart){
				return cart.cart1;
			}
			else {return undefined;}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart1;
			}
			else {return undefined;}
		}
	},
	meliaproduct_details : function (_id){
		return Shop1.findOne({_id: _id});
	},
	kallintikaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				return cart.cart2;
			}else {
				return undefined;
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart2;
			}
			else {return undefined;}
		}
	},
	kallintikaproduct_details : function (_id){
		return Shop2.findOne({_id: _id});
	},
	NUM_OF_ITEMS: function () {
		var items = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					items += parseInt(products[i].quantity);
				}
			}
		}
		return items;
	},
	TOTAL_PRICE: function () {
		var price = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		return price;
	}
});

Template.orders.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	logged: function (){
		if (Meteor.user()) return true;
		return false;
	},
	orders : function () {
		return Orders.find({user: Meteor.userId()}, {sort: {createdOn: -1}});
	},
	orderedOn : function(_id) {
		var order = Orders.findOne({_id: _id});
		var date = order.createdOn;
		return  (date.getHours() <10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes()) + "  " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
	},
	Num_Items : function(_id) {
		var order = Orders.findOne({_id: _id});
		var items = 0;
		var products = order.cart1;
		for (var i = 0; i< products.length; i++) {
			items += parseInt(products[i].quantity);
		}
		products = order.cart2;
		for (var i = 0; i< products.length; i++) {
			items += parseInt(products[i].quantity);
		}
		return items;
	},
	Total_Price: function (_id) {
		var price =0 ;
		var order = Orders.findOne({_id: _id});
		var products = order.cart1;
		for (var i = 0; i< products.length; i++) {
			price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
		}
		products = order.cart2;
		for (var i = 0; i< products.length; i++) {
			price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
		}
		return price;
	},
	status : function (_id) {
		var order = Orders.findOne({_id:_id});
		if (order.completedOn) {
			var date = order.completedOn;
			return  (Session.get("language") == "eng" ? "Completed on " : "Ολοκληρώθηκε στις ") + (date.getHours() <10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes()) + "  " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
			return order.completedOn;
		}
		else {
			return (Session.get("language") == "eng" ? "Incomplete" : "Σε εκρεμότητα");
		}
	},
	meliaproduct : function (_id){
		var order = Orders.findOne({_id: _id});
		return order.cart1;
	},
	meliaproduct_details : function (_id){
		return Shop1.findOne({_id: _id});
	},
	kallintikaproduct : function (_id){
		var order = Orders.findOne({_id:_id});
		return order.cart2;
	},
	kallintikaproduct_details : function (_id){
		return Shop2.findOne({_id: _id});
	}
});

Template.orders.events({
	'click .js-order-select' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		$("#modal_" + id).modal("show");
	}
});

Template.cart.events({
	'click .js-plus-item-to-cart1' :function (event) {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : products,
					cart2: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : products,
					cart2: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
	},
	'click .js-minus-item-to-cart1' :function (event) {
		var quant = "-1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
					//as a first strategy don't allow the quantity to fall below 0
					if (parseInt(products[index].quantity) < 0) products[index].quantity = "0";
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : products,
					cart2: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
					//as a first strategy don't allow the quantity to fall below 0
					if (parseInt(products[index].quantity) < 0) products[index].quantity = "0";
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : products,
					cart2: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
	},

	'click .js-plus-item-to-cart2' :function (event) {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : [],
					cart2: products,
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : [],
					cart2: products,
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
	},
	'click .js-minus-item-to-cart2' :function (event) {
		var quant = "-1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
					//as a first strategy don't allow the quantity to fall below 0
					if (parseInt(products[index].quantity) < 0) products[index].quantity = "0";
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : [],
					cart2: products,
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
					//as a first strategy don't allow the quantity to fall below 0
					if (parseInt(products[index].quantity) < 0) products[index].quantity = "0";
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : [],
					cart2: products,
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
	},

	'click .js-remove-item-from-cart1' : function (event) {
		var cart,id;
		if (Meteor.user()) {
			cart = Cart.findOne({user:Meteor.userId()});
		}
		else {
			id = Session.get("cart_id");
			//no check is neccessary
			cart = Cart.findOne({_id: id});
		}
		var products = cart.cart1;
		var context = this;
		var index = products.findIndex(function (p) {
				return p._id == context._id
			});
		products.splice(index,1);		
		//update the cookie
		var d = new Date();
		if (!Meteor.user()) {
			setCookie("cart_id", id, d, 5);
		}
		//now update the accessedOn of the cart
		cart.accessedOn = d;
		//update the the cart object to the database
		Meteor.call("updateCart", cart, cart._id);
	},
	'click .js-remove-item-from-cart2' : function (event) {
		var cart,id;
		if (Meteor.user()) {
			cart = Cart.findOne({user:Meteor.userId()});
		}
		else {
			id = Session.get("cart_id");
			//no check is neccessary
			cart = Cart.findOne({_id: id});
		}
		var products = cart.cart2;
		var context = this;
		var index = products.findIndex(function (p) {
				return p._id == context._id
			});
		products.splice(index,1);		
		//update the cookie
		var d = new Date();
		if (!Meteor.user()) {
			setCookie("cart_id", id, d, 5);
		}
		//now update the accessedOn of the cart
		cart.accessedOn = d;
		//update the the cart object to the database
		Meteor.call("updateCart", cart, cart._id);
	},
	'click .js-shoppingcart-checkout' : function (event) {
		event.preventDefault();
		Router.go('/checkout');
	}
});

Template.wishlist.helpers({
	isEmpty: function () {
		var wishlist = Wishlist.findOne({user: Meteor.userId()});
		if (!wishlist) return true;
		else {
			if (wishlist.shop1.length == 0 && wishlist.shop2.length == 0) {
				return true;
			}else {
				for (var i = 0; i< wishlist.shop1.length; i++) {
					if (Shop1.findOne({_id: wishlist.shop1[i]._id, active:true})) return false;
				}
				for (var i = 0; i< wishlist.shop2.length; i++) {
					if (Shop2.findOne({_id : wishlist.shop2[i]._id, active:true})) return false;
				}
			}
			return true;
		}
	},
	meliaproduct : function () {
		var wishlist = Wishlist.findOne({user: Meteor.userId()});
		if (wishlist) {
			return wishlist.shop1.filter(function(prod) {
				if (Shop1.findOne({_id: prod._id, active:true})) return true;
				else return false;
			});
		}else {
			return undefined;
		}
	},
	meliaproduct_details: function (_id) {
		return Shop1.findOne({_id: _id});
	},
	kalliproduct : function () {
		var wishlist = Wishlist.findOne({user: Meteor.userId()});
		if (wishlist) {
			return wishlist.shop2.filter(function (prod) {
				if (Shop1.findOne({_id: prod._id, active:true})) return true;
				else return false;
			});
		}else {
			return undefined;
		}
	},
	kalliproduct_details : function (_id) {
		return Shop2.findOne({_id: _id});
	}
});

Template.company.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	content_gr: function () {
		var html = Html.findOne({category:"company"});
		if (html) {
			return html.html;
		}
		else {
			return undefined;
		}
	}
});

Template.contact.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	content_gr: function () {
		var html = Html.findOne({category: "contact"});
		if (html) {
			return html.html;
		}
		else {
			return undefined;
		}
	}
});

Template.contact.events({
	'submit #container_form' : function (event) {
		event.preventDefault();
		var form = document.forms.container_form;
		var email = form.email.value;
		var msg  = form.message.value;
		var message = {
			email: email,
			msg: msg
		}

		Meteor.call("sendEmail","nikolameli@gmail.com",email, "Contact Page Message Meli Melitini","from: " + email + "\r\n" + msg);
		
		Meteor.call("addToMessages", message);
		form.email.value="";
		form.message.value = "";
		alert((Session.get("language") == "eng" ? "Thank you for your message" : "Ευχαρηστούμε που επικοινωνήσατε μαζί μας"));
	}
});

Template.wishlist.events({
	'click .js-remove-from-wishlist-shop1' :function (event) {
		event.preventDefault();
		var wishlist = Wishlist.findOne({user: Meteor.userId()});
		var products = wishlist.shop1;
		var context = this;
		var index = products.findIndex(function (p,) {
			return p._id == context._id
		});
		products.splice(index,1);
		Meteor.call("updateWishlist", wishlist, wishlist._id);
	},
	'click .js-remove-from-wishlist-shop2' :function (event) {
		event.preventDefault();
		var wishlist = Wishlist.findOne({user: Meteor.userId()});
		var products = wishlist.shop2;
		var context = this;
		var index = products.findIndex(function (p,) {
			return p._id == context._id
		});
		products.splice(index,1);
		Meteor.call("updateWishlist", wishlist, wishlist._id);
	},
	'click .js-add-to-cart1' : function () {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart1 : products,
					cart2: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart1;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart1 : products,
					cart2: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();	
	},
	'click .js-add-to-cart2' : function () {
		var quant = "1";
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				//the cart exists
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				cart.accessedOn = new Date();
				Meteor.call("updateCart", cart, cart._id);
			}
			else {
				//the cart doesn't exists
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var cart =  {
					cart2 : products,
					cart1: [],
					user: Meteor.userId(),
					accessedOn : new Date()
				};
				Meteor.call("insertToCart", cart);
			}
		}else {
			var id = getCookie("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				var products  = cart.cart2;
				var context = this;
				var index = products.findIndex(function (p,) {
					return p._id == context._id
				});
				if (index >=0 ) {
					products[index].quantity = parseInt(products[index].quantity) + parseInt(quant);
				}
				else {
					products.push({
						_id: this._id,
						quantity: quant
					});
				}
				//update the cookie
				var d = new Date();
				setCookie("cart_id", id, d, 5);
				//now update the accessedOn of the cart
				cart.accessedOn = d;
				//update the the cart object to the database
				Meteor.call("updateCart", cart, id);
			}
			else {
				var products = [
					{
						_id: this._id,
						quantity: quant
					}
				];
				//create the cart object for the database
				var d = new Date();
				var cart =  {
					cart2 : products,
					cart1: [],
					user: null,
					accessedOn : d
				};
				Meteor.call("insertToCart", cart, function (err,id) {
					setCookie("cart_id", id, d, 5);
					Session.set("cart_id", id);
				});
			}
		}
		$("#add_to_cart_quantiy").val("1");
		animateCart();	
	}
});

Template.update_profile.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	logged : function () {
		if (Meteor.user()) return true;
		return false;
	},
	firstname : function () {
		return Meteor.user().profile.firstname;
	},
	lastname : function () {		
		return Meteor.user().profile.lastname;
	},
	email : function () {
		return Meteor.user().emails[0].address;
	},
	address : function () {		
		return Meteor.user().profile.address;
	},
	region : function () {		
		return Meteor.user().profile.region;
	},
	postalcode : function () {	
		return Meteor.user().profile.postalcode;
	}
});

Template.update_profile.events({
	'click .js-cancel-button' : function (event) {
		history.back();
	},
	'submit #container_form' : function (event) {
		event.preventDefault();
		var form = document.forms.container_form;
		var firstname = form.firstname.value;
		var lastname = form.lastname.value;
		var region = form.region.value;
		var address = form.address.value;
		var postalcode = form.postalcode.value;
		var profile = {
			firstname :firstname,
			lastname : lastname,
			region : region,
			address: address,
			postalcode: postalcode
		}
		Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
		Router.go('/');
	}
});

//----------------CHECKOUT------------------//

Template.checkout.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	firstname : function () {
		if (Meteor.user()) {
			return Meteor.user().profile.firstname;
		}
		else {
			return undefined;
		}
	},
	lastname : function () {
		if (Meteor.user()) {
			return Meteor.user().profile.lastname;
		}
		else {
			return undefined;
		}
	},
	email : function () {
		if (Meteor.user()) {
			return Meteor.user().emails[0].address;
		}
		else {
			return undefined;
		}
	},
	address : function () {
		if (Meteor.user()) {
			return Meteor.user().profile.address;
		}
		else {
			return undefined;
		}
	},
	region : function () {
		if (Meteor.user()) {
			return Meteor.user().profile.region;
		}
		else {
			return undefined;
		}
	},
	postalcode : function () {
		if (Meteor.user()) {
			return Meteor.user().profile.postalcode;
		}
		else {
			return undefined;
		}
	},
	meliaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart){
				return cart.cart1;
			}
			else {return undefined;}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart1;
			}
			else {return undefined;}
		}
	},
	meliaproduct_details : function (_id){
		return Shop1.findOne({_id: _id});
	},
	kallintikaproduct : function (){
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				return cart.cart2;
			}else {
				return undefined;
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) { //there is a cart to call from the database
				cart = Cart.findOne({_id: id});
				return cart.cart2;
			}
			else {return undefined;}
		}
	},
	kallintikaproduct_details : function (_id){
		return Shop2.findOne({_id: _id});
	},
	TOTAL_PRICE: function () {
		var price = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		return price;
	}
});

Template.checkout.onRendered = function() {
	Session.set("payment",undefined);
}

Template.checkout.events({
	'submit #card_info' : function (event) {
		//create the order and give it a status of verified false
	},
	'submit #container_form' : function (event) {
		event.preventDefault();
		//create the order and give it a status of verified false
		//we need to read the recipient's information
		var form = document.forms.container_form;
		var firstname = form.firstname.value;
		if (firstname == "") {
			alert((Session.get("language") == "eng"? "Please fill your first name in the receipient's information" : "Παρακαλούμε συμπληρώστε το Όνομά σας στις πληροφορίες παραλήπτη"));
			return;
		}
		var lastname = form.lastname.value;
		var email = form.email.value;
		var region = form.region.value;
		var address = form.address.value;
		var postalcode = form.postalcode.value;
		if (lastname == "") {
			alert((Session.get("language") == "eng"? "Please fill your last name in the receipient's information" : "Παρακαλούμε συμπληρώστε το Επίθετό σας στις πληροφορίες παραλήπτη"));
			return;
		}
		if (email == "") {
			alert((Session.get("language") == "eng"? "Please fill your email in the receipient's information" : "Παρακαλούμε συμπληρώστε το email σας στις πληροφορίες παραλήπτη"));
			return;
		}
		if (region == "") {
			alert((Session.get("language") == "eng"? "Please fill your region in the receipient's information" : "Παρακαλούμε συμπληρώστε την περιοχή σας στις πληροφορίες παραλήπτη"));
			return;
		}
		if (address == "") {
			alert((Session.get("language") == "eng"? "Please fill your address in the receipient's information" : "Παρακαλούμε συμπληρώστε την διεύθυνσή σας στις πληροφορίες παραλήπτη"));
			return;
		}
		if (postalcode == "") {
			alert((Session.get("language") == "eng"? "Please fill your postal code in the receipient's information" : "Παρακαλούμε συμπληρώστε τον ταχυδρομικό σας κώδικα στις πληροφορίες παραλήπτη"));
			return;
		}
		if (Session.get("payment") == undefined) {
			alert((Session.get("language") == "eng"? "Please select one of the payment methods below" : "Παρακαλούμε επιλέξτε μία από τις μεθόδους πληρωμής παρακάτω."));
			return;
		}
		var order;
		if (Meteor.user()) {
			//if there is a user logged in
			var cart = Cart.findOne({user: Meteor.userId()});
			order = {
				user : Meteor.userId(),
				cart1 : cart.cart1,
				cart2 : cart.cart2,
				firstname: firstname,
				lastname : lastname,
				email : email,
				region : region,
				address : address,
				postalcode : postalcode,
				createdOn : new Date(),
				payment : Session.get("payment"),
				verified : "yes", //this goes in only for the credit card
				completedOn: undefined
			};
			//remove the cart for the current order
			//user is logged in so we just have to delete the
			//cart object from the mongo db
			Meteor.call("removeCart", cart._id);

		}
		else {
			//guest user
			var id = Session.get("cart_id");
			var cart = Cart.findOne({_id: id});
			order = {
				user : undefined,
				cart1 : cart.cart1,
				cart2 : cart.cart2,
				firstname: firstname,
				lastname : lastname,
				email : email,
				region : region,
				address : address,
				postalcode : postalcode,
				createdOn : new Date(),
				payment : Session.get("payment"),
				verified : "yes", //this goes in only for the credit card
				completedOn: undefined
			};
			//remove the cart for the current order
			//user isn't logged in so we just have to delete the
			//cookie
			removeCookie("cart_id");
		}
		Meteor.call("addOrderPaidOnDelivery", order);
		var msg;
		if (Session.get("language") == "eng") {
			if (Session.get("payment") == "Πληρωμή με αντικαταβολή") {
				msg = "<h2>Thank you for your order</h2><p>Your order has been placed and it will be delivered to you in the next 3-4 business days</p><p>If you have any questions, please feel free to contact us.</p>";
			}
			else if (Session.get("payment") == "Κατάθεση στον Λογαριασμό 1") {
				msg = "<h2>Thank you for your order</h2><p>Your order has been placed. Please deposit this ammount to Bank 1 in the following account</p><p>IBAN: Number of Account 1</p><p>After confirmation we will send you the order</p>";
			}
			else if (Session.get("payment") == "Κατάθεση στον Λογαριασμό 2") {
				msg = "<h2>Thank you for your order</h2><p>Your order has been placed. Please deposit this ammount to Bank 2 in the following account</p><p>IBAN: Number of Account 2</p><p>After confirmation we will send you the order</p>";
			}
			else if (Session.get("payment") == "Ανταλλαγή Προϊόντων...") {
				msg = "<h2>Thank you for your order</h2><p>Your order has been placed. Please send us an email explaining what you are offering for exchange.</p><p>You can also contuct us by phone</p>";
			}

		}
		else {
			if (Session.get("payment") == "Πληρωμή με αντικαταβολή") {
				msg = "<h2>Σας ευχαριστούμε για την επιλογή σας</h2><p>Λάβαμε την παραγγελία σας, και θα την έχουμε κοντά σας σε 3-4 εργάσιμες μέρες.</p><p>Αν έχετε οποιαδήποτε ερώτηση, επικοινωνήστε μαζί μας</p>";
			}
			else if (Session.get("payment") == "Κατάθεση στον Λογαριασμό 1") {
				msg = "<h2>Σας ευχαριστούμε για την επιλογή σας</h2><p>Λάβαμε την παραγγελία σας. Παρακαλούμε καταθέστε στην τράπεζα 1 το ακόλουθο ποσό:</p><p>IBAN: Αριθμό λογαριασμού 1</p><p>Αφού επιβεβαιώσουμε την πληρωμή θα σας αποστείλουμε την παραγγελία σας</p>";
			}
			else if (Session.get("payment") == "Κατάθεση στον Λογαριασμό 2") {
				msg = "<h2>Σας ευχαριστούμε για την επιλογή σας</h2><p>Λάβαμε την παραγγελία σας. Παρακαλούμε καταθέστε στην τράπεζα 2 το ακόλουθο ποσό:</p><p>IBAN: Αριθμό λογαριασμού 2</p><p>Αφού επιβεβαιώσουμε την πληρωμή θα σας αποστείλουμε την παραγγελία σας</p>";
			}
			else if (Session.get("payment") == "Ανταλλαγή Προϊόντων...") {
				msg = "<h2>Σας ευχαριστούμε για την επιλογή σας</h2><p>Λάβαμε την παραγγελία σας. Παρακαλούμε στείλτε μας ένα email στο οποίο να περιγράφετει το προϊόν ή υπηρεσία που θέλετε να ανταλλάξετε.</p><p>Μπορείτε να επικοινωνήσεται μαζί μας μέσο τηλεφώνου.</p>";
			}
		}
		Meteor.call("sendEmail",email,"nikolameli@gmail.com", (Session.get("language") == "eng" ? "Order confirmation" : "Επιβεβαίωση παραγγελίας"),msg);
		Router.go('/thankyou');
	},
	'click #option1': function (event) {
		if ($("#option1").is(":checked")) {
			$("#option2").attr("checked",false);
			$("#option3").attr("checked",false);
			$("#option4").attr("checked", false);
			Session.set("payment","Πληρωμή με αντικαταβολή");
		}
	},
	'click #option2': function (event) {
		if ($("#option2").is(":checked")) {
			$("#option1").attr("checked",false);
			$("#option3").attr("checked",false);
			$("#option4").attr("checked",false);
			Session.set("payment","Κατάθεση στον Λογαριασμό 1");
		}
	},
	'click #option3': function (event) {
		if ($("#option3").is(":checked")) {
			$("#option1").attr("checked",false);
			$("#option2").attr("checked",false);
			$("#option4").attr("checked", false);
			Session.set("payment","Κατάθεση στον Λογαριασμό 2");
		}
	},
	'click #option4': function (event) {
		if ($("#option4").is(":checked")) {
			$("#option1").attr("checked",false);
			$("#option2").attr("checked",false);
			$("#option3").attr("checked", false);
			Session.set("payment","Ανταλλαγή Προϊόντων...");
		}
	}
});

Template.checkout.onRendered(function () {
	Meteor.call('getClientToken', function(error, clientToken) {
      if (error) {
        console.log(error);
      } else {
      	var cart_id;
      	var price = 0;
		if (Meteor.user()) {
			var cart = Cart.findOne({user: Meteor.userId()});
			if (cart) {
				var products = cart.cart1;
				cart_id = cart._id;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
		else {
			var id = Session.get("cart_id");
			cart_id = id;
			var cart;
			if (id) {
				cart = Cart.findOne({_id: id});
				var products = cart.cart1;
				for (var i = 0; i< products.length; i++) {
					price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
				products = cart.cart2;
				for (var i = 0; i< products.length; i++) {
					price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
				}
			}
		}
        braintree.setup(clientToken, "dropin", {
          container: "payment-form", // Injecting into <div id="payment-form"></div>
          onPaymentMethodReceived: function (response) {
            // When we submit the payment form,
            // we'll receive a response that includes
            // payment method nonce:
            var nonce = response.nonce;
            
            Meteor.call("createTransaction", nonce,price, function(error, success) {
              if (error) {
                throw new Meteor.Error('transaction-creation-failed');
              } else {
                Router.go('/thankyou');
              }
            });
          }
        });
      }
    });
});


Template.templatetitle.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	}
});

Template.thankyou.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	}
});


Template.katastimata.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	salespoints : function() {
		return Salespoints.find({});
	}
});


//other functions


function userStatusChanged() {
	if (Session.get("userStatus") == "loggedin") {
		//load the users cart
		
	}else {

	}
}


function setCookie(cname, cvalue, d, exdays) {
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return undefined;
}

function removeCookie(cname){
	document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	setUpSessionCartId();
}


function trimText(text, len, id) {
	var result = "";
	var word= "";
	var i;
	for (i =0; i<len && i < text.length; i++) {
		var c = text.charAt(i);
		if (c != ' ')
			word += c;
		else {
			word += c;
			result += word;
			word = "";
		}
	}
	if (i != text.length) {
		result += "...";
	}
	else {
		result += word;
	}
	return result;
}

function fixProductHeights() {
	var doms = $(".description");
	for (var i = 0; i<doms.length; i++) {
		var id = doms[i].getAttribute("data");
		$("#product_" + id).height(doms[i].clientHeight + 250);
	}
}


