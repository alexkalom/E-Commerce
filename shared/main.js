Meteor.methods({
	setMailEnv: function(email,password) {
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				var emaildata = emailInfo.findOne();
				if (emaildata) {
					emailInfo.update({_id: emaildata._id}, {"email": email, "pass": password});
				}
				else {
					emailInfo.insert({"email": email, "pass": password});
				}
				process.env.MAIL_URL="smtp://" + encodeURIComponent(email) + ":"+ encodeURIComponent(password) + "@smtp.gmail.com:587";
			}
		}
	},
	getMailEnv: function () {
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				return emailInfo.findOne();
			}
		}
	},
	insertToCart: function (obj) {
		//do some security checks
		var id = Cart.insert(obj);
		return id;
	},
	updateCart: function (obj, id) {
		//do some security checks
		Cart.update({_id:id}, obj);
	},
	removeCart: function (_id) {
		//check if the user is logged in and also
		//check that the cart belongs to this user.
		if (this.userId) {
			//the user is logged in
			var cart = Cart.findOne({_id: _id});
			if (cart.user == this.userId) {
				//the cart belongs to the user
				Cart.remove({_id: _id});
			}
			
		}
	},
	insertToWishlist : function (obj) {
		//do some security checks
		Wishlist.insert(obj);
	},
	insertToSalespoints : function(obj) {
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				Salespoints.insert(obj);
			}
		}
	},
	insertTips: function(obj) {
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				Tips.insert(obj);
			}
		}
	},
	insertHtml: function (obj) {
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				Html.insert(obj);
			}
		}
	},
	updateHtml: function(obj,id){ 
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				Html.update({_id: id}, obj);
			}
		}
	},
	updateTips: function(obj,id){ 
		if (this.userId) {
			if (Administrators.findOne({userId: this.userId})) {
				Tips.update({_id: id}, obj);
			}
		}
	},
	updateWishlist: function (obj, id) {
		//do some security checks if nessecary
		Wishlist.update({_id: id}, obj);
	},
	addOrderPaidOnDelivery : function (obj) {
		if (obj.payment == "Πληρωμή με αντικαταβολή" || obj.payment == "Κατάθεση στον Λογαριασμό 1" || obj.payment == "Κατάθεση στον Λογαριασμό 2" || obj.payment == "Ανταλλαγή Προϊόντων...") {
			Orders.insert(obj);
		}
	},
	updateOrder: function (obj) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			Orders.update({_id: obj._id}, obj);
		}
	},
	addToMessages : function (msg) {
		if (msg.email && msg.msg) {
			Messages.insert(msg);
		}
	},
	insertProductToShop1 : function (product) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			product.active = true;
			Shop1.insert(product);
		}
	},
	insertProductToShop2 : function (product) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			product.active = true;
			Shop2.insert(product);
		}
	},
	updateMeliaProduct : function (product, _id) {
		if (Administrators.findOne({userId: this.userId})) {
			Shop1.update({_id: _id}, product);
		}
	},
	removeProductFromShop1: function (_id) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			var product = Shop1.findOne({_id: _id});
			product.active = false;
			Meteor.call("updateMeliaProduct", product, _id);
			//Shop1.remove({_id: _id});
		}
	},
	removeProductFromShop2: function (_id) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			Shop2.remove({_id: _id});
		}
	},
	updateKalliProduct : function (product, _id) {
		if (Administrators.findOne({userId: this.userId})) {
			Shop2.update({_id: _id}, product);
		}
	},
	updateSalespoint: function(point, _id) {
		if (Administrators.findOne({userId: this.userId})) {
			Salespoints.update({_id: _id}, point);
		}
	},
	removeSalespoint: function (_id) {
		if (Administrators.findOne({userId: this.userId})) {
			//we have an administrator
			Salespoints.remove({_id: _id});
		}
	},
  	sendEmail: function (to, from, subject, text) {
	    // Let other method calls from the same client start running,
	    // without waiting for the email sending to complete.
	    this.unblock();

	    Email.send({
	      to: to,
	      from: from,
	      subject: subject,
	      html: text,
	    });
  	}
});