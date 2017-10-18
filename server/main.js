Meteor.publish("shop1", function () {
	return Shop1.find({});
});
Meteor.publish("shop2", function () {
	return Shop2.find({});
});
Meteor.publish("cart", function () {
	return Cart.find({});
});
Meteor.publish("wishlist", function() {
	return Wishlist.find({user: this.userId});
});
Meteor.publish("orders", function() {
	if (this.userId) {
		//there is a user logged in
		//return only the orders that have to do with the current user
		if (Administrators.findOne({userId: this.userId})) {
			return Orders.find({});
		}
		return Orders.find({user: this.userId});
	}
});

Meteor.publish("administrators", function () {
	if (this.userId) {
		if (Administrators.findOne({userId: this.userId})) {
			return Administrators.find({});
		}
		else {
			//the user is not an administrator;
			//we need to check if there are any administrators at all
			var count = Administrators.find({}).count();
			if (count == 0) {
				//we need to add this user as an administrator
				Administrators.insert({userId: this.userId});
				return Administrators.find({});
			}
		}
	}
});

Meteor.publish("currentUserData", function () {
	if (this.userId) {
		if (Administrators.findOne({userId: this.userId})) {
			return Meteor.users.find({});
		}
	}
});

Meteor.publish("salespoints", function () {
	return Salespoints.find({});
});

Meteor.publish("tips", function() {
	return Tips.find({});
});
Meteor.publish("html", function () {
	return Html.find({});
});
