Meteor.subscribe("administrators");
Meteor.subscribe("currentUserData");
Meteor.subscribe("shop1");
Meteor.subscribe("shop2");
Meteor.subscribe("orders");
Meteor.subscribe("salespoints");
Meteor.subscribe("tips");
Meteor.subscribe("html");
var IntervalId;
var completeOrderId;
var available;

Template.admin_navbar.helpers({
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

Template.admin_home.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	admin: function () {
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
	},
	orders : function () {
		return Orders.find({completedOn: undefined}, {sort: {createdOn: 1}});
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

Template.admin_home.events({
	'click .js-order-select' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		$("#modal_" + id).modal("show");
	},
	'click .js-button-complete' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		$("#modal_" + id).modal('hide');
		completeOrderId = id;
		IntervalId = setInterval(completeOrder, 500);
		/**/
	}
});

/*Template.admin_home.onCreated(function () {
	if (!Administrators.findOne({userId: Meteor.userId()})) {
		history.back();
	}
});*/


Template.admin_orders_history.helpers({
	eng : function () {
		if (Session.get("language") == "eng") {
			return true;
		}
		else {
			return false;
		}
	},
	admin: function () {
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
	},
	orders : function () {
		return Orders.find({},{sort: {createdOn: -1}});
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

Template.admin_orders_history.events({
	'click .js-order-select' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		$("#modal_" + id).modal("show");
	}
});

Template.admin_new_product.helpers({
	admin: function () {
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

Template.admin_new_product.events({
	'submit #container_form' : function (event){ 
		event.preventDefault();
		var form = document.forms.container_form;
		var shop = form.shop.value;
		var name_gr = form.name_gr.value;
		var name_eng = form.name_eng.value;
		var img = form.img.value;
		var price = form.price.value;
		var contains_eng = form.contains_eng.value;
		var contains_gr = form.contains_gr.value;
		var description_eng = form.description_eng.value;
		var description_gr = form.description_gr.value;
		var available = true;
		img = img.replace("open?", "uc?export=view&");
		var product = {
			name_gr: name_gr,
			name_eng : name_eng,
			img_src: img,
			price : price,
			contains_gr :contains_gr,
			contains_eng : contains_eng,
			description_gr : description_gr,
			description_eng: description_eng,
			available : true
		};
		if (shop == "shop1") {
			Meteor.call("insertProductToShop1", product);
		}else {
			Meteor.call("insertProductToShop2", product);
		}
		Router.go('/admin');
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	}
});

Template.admin_all_products_melia.helpers({
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
	},
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
	trim: function (text) {
		return trimText(text,350);
	}
});

Template.admin_all_products_kallintika.helpers({
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
	},
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
	trim: function (text) {
		return trimText(text,350);
	}
});

Template.admin_update_kalli_product.helpers({
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
	},
	getavailable: function () {
		return Session.get("available");
	}
});

Template.admin_update_melia_product.helpers({
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
	},
	getavailable: function () {
		return Session.get("available");
	}
});

Template.admin_update_melia_product.events({
	'submit #container_form' : function(event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		var form = document.forms.container_form;
		var name_eng = form.name_eng.value;
		var name_gr = form.name_gr.value;
		var price = form.price.value;
		var img_src = form.img_src.value;
		img_src = img_src.replace("open?","uc?export=view&");
		var contains_gr = form.contains_gr.value;
		var contains_eng = form.contains_eng.value;
		var description_eng = form.description_eng.value;
		var description_gr = form.description_gr.value;
		var product = {
			name_eng : name_eng,
			name_gr : name_gr,
			img_src: img_src,
			price: price,
			contains_eng: contains_eng,
			contains_gr : contains_gr,
			description_gr : description_gr,
			description_eng : description_eng,
			available: Session.get("available"),
			active:true
		};
		Meteor.call("updateMeliaProduct", product, _id);
		history.back();
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	},
	'click .js-toogle-availability' : function(event) {
		event.preventDefault();
		if (Session.get("available") == true) {
			Session.set("available", false);
		}
		else {
			Session.set("available", true);
		}
	},
	'click .js-remove-product' : function (event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		Meteor.call("removeProductFromShop1",_id);
		history.back();
	}
});
Template.admin_update_kalli_product.events({
	'submit #container_form' : function(event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		var form = document.forms.container_form;
		var name_eng = form.name_eng.value;
		var name_gr = form.name_gr.value;
		var price = form.price.value;
		var img_src = form.img_src.value;
		img_src = img_src.replace("open?","uc?export=view&");
		var contains_gr = form.contains_gr.value;
		var contains_eng = form.contains_eng.value;
		var description_eng = form.description_eng.value;
		var description_gr = form.description_gr.value;
		var product = {
			name_eng : name_eng,
			name_gr : name_gr,
			img_src: img_src,
			price: price,
			contains_eng: contains_eng,
			contains_gr : contains_gr,
			description_gr : description_gr,
			description_eng : description_eng,
			available: Session.get("available"),
			active:true
		};
		Meteor.call("updateKalliProduct", product, _id);
		history.back();
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	},
	'click .js-toogle-availability' : function(event) {
		event.preventDefault();
		if (Session.get("available") == true) {
			Session.set("available", false);
		}
		else {
			Session.set("available", true);
		}
	},
	'click .js-remove-product' : function (event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		Meteor.call("removeProductFromShop2",_id);
		history.back();
	}
});

Template.admin_users.helpers({
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
	},
	users : function () {
		var a = Meteor.users.find({});
		return a;
	},
	email : function (_id) {
		var user = Meteor.users.findOne({_id: _id});
		return user.emails[0].address;
	},
	num_of_orders: function (_id) {
		return Orders.find({user: _id}).count();
	},
	total_price: function (_id) {
		var orders = Orders.find({user:_id}).fetch();
		var price = 0;
		for (var j = 0; j< orders.length; j++) {
			var products = orders[j].cart1;
			for (var i = 0; i< products.length; i++) {
				price += Shop1.findOne({_id: products[i]._id}).price * products[i].quantity;
			}
			products = orders[j].cart2;
			for (var i = 0; i< products.length; i++) {
				price += Shop2.findOne({_id: products[i]._id}).price * products[i].quantity;
			}
		}
		return price;
	},
	last_seen : function (_id) {
		var orders = Orders.find({user:_id}, {sort: {createdOn: -1}}).fetch();
		if (orders.length == 0) return "No orders";
		var date =  orders[0].createdOn;
		return  (date.getHours() <10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes()) + "  " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
	}
});


Template.admin_users.events({
	'click .js-user-select' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		Session.set("admin", "all");
		Router.go('/admin/admin_user_details/' + id);
	}
});

Template.admin_user_details.helpers({
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
	},
	firstname : function (_id) {
		var user = Meteor.users.findOne({_id: _id});
		return user.profile.firstname;
	},
	lastname: function (_id) {
		var user = Meteor.users.findOne({_id: _id});
		return user.profile.lastname;
	},
	email : function (_id) {
		var user = Meteor.users.findOne({_id: _id});
		return user.emails[0].address;
	},
	orders : function (_id) {
		if (Session.get("admin") == "all") 
			return Orders.find({user: _id}, {sort: {createdOn: -1}});
		else if (Session.get("admin") == "month") {
			var orders = Orders.find({user: _id}, {sort: {createdOn: -1}}).fetch();
			return orders.filter(isNewerThanMonth);
		}
		else if (Session.get("admin") == "threemonths") {
			var orders = Orders.find({user: _id}, {sort: {createdOn: -1}}).fetch();
			return orders.filter(isNewerThanThreeMonths);
		}
		else if (Session.get("admin") == "year") {
			var orders = Orders.find({user: _id}, {sort: {createdOn: -1}}).fetch();
			return orders.filter(isNewerThanYear);
		}
		return null;
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

Template.admin_user_details.events({
	'click .js-order-select' : function (event) {
		var id  = event.currentTarget.attributes.data.value;
		$("#modal_" + id).modal("show");
	},
	'click .js-user-all-orders' : function(event) {
		Session.set("admin","all");
		$(".filter-btn").removeClass("active");
		$(".js-user-all-orders").addClass("active");
	},
	'click .js-user-month-orders' : function(event) {
		Session.set("admin", "month");
		$(".filter-btn").removeClass("active");
		$(".js-user-mont-orders").addClass("active");
	},
	'click .js-user-threemonths-orders' : function(event) {
		Session.set("admin","threemonths");
		$(".filter-btn").removeClass("active");
		$(".js-user-threemonts-orders").addClass("active");
	},
	'click .js-user-year-orders' : function(event) {
		Session.set("admin", "year");
		$(".filter-btn").removeClass("active");
		$(".js-user-year-orders").addClass("active");
	}
});
function completeOrder() {
	var order = Orders.findOne({_id:completeOrderId});
	order.completedOn = new Date();
	Meteor.call("updateOrder", order);
	clearInterval(IntervalId);
}

function isNewerThanMonth(order) {
	var date = order.createdOn;
	var ndate = new Date();
	if (date.getTime() - (ndate.getTime() - 30 * 24 * 3600 * 1000) < 0 ) return false;
	return true;
}

function isNewerThanThreeMonths(order) {
	var date = order.createdOn;
	var ndate = new Date();
	if (date.getTime() - (ndate.getTime() - 90 * 24 * 3600 * 1000) < 0 ) return false;
	return true;
}

function isNewerThanYear(order) {
	var date = order.createdOn;
	var ndate = new Date();
	if (date.getTime() - (ndate.getTime() - 365 * 24 * 3600 * 1000) < 0 ) return false;
	return true;
}


Template.admin_manage_salespoints.helpers({
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
	},
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
Template.admin_manage_salespoints.events({
	'click .js-add-new-salepoint' : function (event) {
		event.preventDefault();
		Router.go('/admin_manage_salespoints/new');
	}
});

Template.admin_update_sales_point.helpers({
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
	},
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

Template.admin_update_sales_point.events({
	'click .js-remove-salespoint' : function (event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		Meteor.call("removeSalespoint", _id);
		history.back();
	},
	'submit #container_form' : function(event) {
		event.preventDefault();
		var _id  = event.currentTarget.attributes.data.value;
		var form = document.forms.container_form;
		var name_gr = form.name_gr.value;
		var name_eng = form.name_eng.value;
		var extra_gr = form.extra_gr.value;
		var extra_eng = form.extra_eng.value;
		var address_gr = form.address_gr.value;
		var address_eng = form.address_eng.value;
		var phone = form.phone.value;
		var latitude = form.latitude.value;
		var longtitude = form.longtitude.value;
		var shop = {
			name_gr: name_gr,
			name_eng: name_eng,
			extra_gr: extra_gr,
			extra_eng: extra_eng,
			address_gr: address_gr,
			address_eng: address_eng,
			phone : phone,
			latitude : latitude,
			longtitude : longtitude
		};
		Meteor.call("updateSalespoint", shop, _id);
		history.back();
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	},
});

Template.admin_new_salespoint.helpers({
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
	},
});

Template.admin_new_salespoint.events({
	'submit #container_form' : function (event){ 
		event.preventDefault();
		var form = document.forms.container_form;
		var name_gr = form.name_gr.value;
		var name_eng = form.name_eng.value;
		var extra_gr = form.extra_gr.value;
		var extra_eng = form.extra_eng.value;
		var address_gr = form.address_gr.value;
		var address_eng = form.address_eng.value;
		var phone = form.phone.value;
		var latitude = form.latitude.value;
		var longtitude = form.longtitude.value;
		var shop = {
			name_gr: name_gr,
			name_eng: name_eng,
			extra_gr: extra_gr,
			extra_eng: extra_eng,
			address_gr: address_gr,
			address_eng: address_eng,
			phone : phone,
			latitude : latitude,
			longtitude : longtitude
		};
		Meteor.call("insertToSalespoints", shop);
		history.back();
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	}
});

Template.admin_manage_tips.helpers({
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
	},
	tipshop1 :function () {
		var tip = Tips.findOne({});
		return tip.shop1;
	},
	tipshop2 :function () {
		var tip = Tips.findOne({});
		return tip.shop2;
	},
});


Template.admin_manage_tips.events({
	'submit #container_form1' : function (event){ 
		event.preventDefault();
		var form = document.forms.container_form1;
		var tip = Tips.findOne();
		for (var i =0; i< tip.shop1.length; i++) {
			tip.shop1[i].text_gr = $("#" + tip.shop1[i].id_gr).val();
			tip.shop1[i].text_eng = $("#" + tip.shop1[i].id_eng).val();
		}
		for (var i =0; i< tip.shop2.length; i++) {
			tip.shop2[i].text_gr = $("#" + tip.shop2[i].id_gr).val();
			tip.shop2[i].text_eng = $("#" + tip.shop2[i].id_eng).val();
		}
		Meteor.call("updateTips", tip,tip._id);
		history.back();
	},
	'click .js-button-cancel' : function (event) {
		history.back();
	}
});

Template.admin_manage_company_page.helpers({
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
	},
	content: function () {
		var doc = Html.findOne({category: "company"});
		if (doc) {
			return doc.html;
		}
		return undefined;
	}
});

Template.admin_manage_company_page.events({
	'submit #container_form' : function (event) {
		event.preventDefault();
		var html = tinyMCE.get("id_" + Session.get("editor_id")).getContent();
		var obj = Html.findOne({category: "company"});
		if (obj) {
			obj.html= html;
			Meteor.call("updateHtml",obj, obj._id);
		}
		else {
			obj = {
				html: html,
				category: "company"
			};
			Meteor.call("insertHtml", obj);
		}
		history.back();
	},
	'click .js-form-cancel' : function (event) {
		event.preventDefault();
		history.back();
	}
});

Template.admin_manage_company_page.onRendered(function () {
	var date = new Date();
	Session.set("editor_id", date.getTime());
	$("#mytextarea").attr("id","id_"  + date.getTime());
	tinymce.init({
    selector: '#id_' + date.getTime(),
    theme: 'modern',
    width: 1000,
    height: 300,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template paste textcolor'
    ],
    content_css: 'css/content.css',
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons'
  });
});


Template.admin_manage_contact_page.helpers({
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
	},
	content: function () {
		var doc = Html.findOne({category: "contact"});
		if (doc) {
			return doc.html;
		}
		return undefined;
	}
});

Template.admin_manage_contact_page.events({
	'submit #container_form' : function (event) {
		event.preventDefault();
		var html = tinyMCE.get("id_" + Session.get("editor_id")).getContent();
		var obj = Html.findOne({category: "contact"});
		if (obj) {
			obj.html= html;
			Meteor.call("updateHtml",obj, obj._id);
		}
		else {
			obj = {
				html: html,
				category: "contact"
			};
			Meteor.call("insertHtml", obj);
		}
		history.back();
	},
	'click .js-form-cancel' : function (event) {
		event.preventDefault();
		history.back();
	}
});

Template.admin_manage_contact_page.onRendered(function () {
	var date = new Date();
	Session.set("editor_id", date.getTime());
	$("#mytextarea").attr("id","id_"  + date.getTime());
	tinymce.init({
    selector: '#id_' + date.getTime(),
    theme: 'modern',
    width: 1000,
    height: 300,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template paste textcolor'
    ],
    content_css: 'css/content.css',
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons'
  });
});



Template.admin_manage_mail.helpers({
	admin: function () {
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
	},
	email: function () {
		Meteor.call("getMailEnv", function (err, ret) {
			if (ret)
				Session.set("email", ret.email);
		});
		if (Session.get("email")) {
			return Session.get("email");
		}
		else {
			return "No email";
		}
	}
});


Template.admin_manage_mail.events({
	'submit #container_form' : function (event) {
		event.preventDefault();
		var form = document.forms['container_form'];
		Meteor.call("setMailEnv",form.email.value,form.pass.value);
		alert("Update completed");
		history.back();
	},
	'click .js-form-cancel' : function (event) {
		event.preventDefault();
		history.back();
	}
});



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
