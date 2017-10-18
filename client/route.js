Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route("/", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("empty",{
		to: "pos2"
	});
});

/*Router.route("/melia", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("melia", {
		to: "pos2"
	});
});
*/

Router.route("/katastimata", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("katastimata", {
		to: "pos2"
	});
});

Router.route("/melia", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("melia2", {
		to: "pos2"
	});
});

Router.route("/proiontakypselis", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("kallintika2", {
		to: "pos2"
	});
});

Router.route("/company",function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("company", {
		to: "pos2"
	});
});
Router.route("/contact",function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("contact", {
		to: "pos2"
	});
});

Router.route("/cart", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("cart", {
		to: "pos2"
	});
});

Router.route("/orders", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("orders", {
		to: "pos2"
	});
});

Router.route("/checkout", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("checkout", {
		to: "pos2"
	});
});

Router.route("/thankyou", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("thankyou", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});

Router.route("/update_profile", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("update_profile", {
		to: "pos2"
	});
});
Router.route("/wishlist", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	if (!Meteor.user()) {
		this.render("empty", {
			to: "pos2"
		});
	}
	else {
		this.render("wishlist", {
			to: "pos2"
		});
	}
});

Router.route("/melia/product/:_id", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("meliaproduct", {
		to: "pos2",
		data: function () {
			return Shop1.findOne({_id: this.params._id});
		}
	});
});

Router.route("/kallintika/product/:_id", function () {
	this.render("navbar", {
		to: "navbar"
	});
	this.render("welcome", {
		to: "pos1"
	});
	this.render("kallintikaproduct", {
		to: "pos2",
		data: function () {
			return Shop2.findOne({_id: this.params._id});
		}
	});
});

Router.route("/admin", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_home", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});	
});

Router.route("/admin_orders_history", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_orders_history", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});

Router.route("/admin_new_product", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_new_product", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_melia_products", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_all_products_melia", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_kalli_products", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_all_products_kallintika", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin/update_melia_product/:_id", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_update_melia_product", {
		to: "pos1",
		data: function () {
			return Shop1.findOne({_id: this.params._id});
		}
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin/update_kalli_product/:_id", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_update_kalli_product", {
		to: "pos1",
		data: function () {
			return Shop2.findOne({_id: this.params._id});
		}
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_users", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_users", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});


Router.route("/admin/admin_user_details/:_id", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_user_details", {
		to: "pos1",
		data: function () {
			return Meteor.users.findOne({_id: this.params._id});
		}
	});
	this.render("empty", {
		to: "pos2"
	});
});

Router.route("/admin_manage_salespoints", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_manage_salespoints", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_manage_salespoints/new", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_new_salespoint", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});

Router.route("/admin/update_sales_point/:_id", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_update_sales_point", {
		to: "pos1",
		data: function () {
			return Salespoints.findOne({_id: this.params._id});
		}
	});
	this.render("empty", {
		to: "pos2"
	});
});

Router.route("/admin_manage_tips", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_manage_tips", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_manage_company_page", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_manage_company_page", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_manage_contact_page", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_manage_contact_page", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});
Router.route("/admin_manage_mail", function () {
	this.render("admin_navbar", {
		to: "navbar"
	});
	this.render("admin_manage_mail", {
		to: "pos1"
	});
	this.render("empty", {
		to: "pos2"
	});
});