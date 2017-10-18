// Define gateway variable 
var gateway;
Meteor.startup(function () {
    if (!Tips.findOne({})) {
      //there is no tip in the database
      //create the base case object
      var tip = {
        shop1: [
          {
            text_gr:"", 
            text_eng:"",
            id_gr: "january_gr",
            id_eng: "january_eng",
            month: "Ιανουάριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "february_gr",
            id_eng: "february_eng",
            month: "Φεβρουάριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "march_gr",
            id_eng: "march_eng",
            month: "Μάρτιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "april_gr",
            id_eng: "april_eng",
            month: "Απρίλιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "may_gr",
            id_eng: "may_eng",
            month: "Μάιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "june_gr",
            id_eng: "june_eng",
            month: "Ιούνιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "july_gr",
            id_eng: "july_eng",
            month: "Ιούλιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "august_gr",
            id_eng: "august_eng",
            month: "Αύγουστος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "september_gr",
            id_eng: "september_eng",
            month: "Σεπτέμβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "october_gr",
            id_eng: "october_eng",
            month: "Οκτόβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "november_gr",
            id_eng: "november_eng",
            month: "Νοέμβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "december_gr",
            id_eng: "december_eng",
            month: "Δεκέμβριος"
          }
        ],
        shop2: [
          {
            text_gr:"", 
            text_eng:"",
            id_gr: "january_gr2",
            id_eng: "january_eng2",
            month: "Ιανουάριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "february_gr2",
            id_eng: "february_eng2",
            month: "Φεβρουάριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "march_gr2",
            id_eng: "march_eng2",
            month: "Μάρτιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "april_gr2",
            id_eng: "april_eng2",
            month: "Απρίλιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "may_gr2",
            id_eng: "may_eng2",
            month: "Μάιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "june_gr2",
            id_eng: "june_eng2",
            month: "Ιούνιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "july_gr2",
            id_eng: "july_eng2",
            month: "Ιούλιος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "august_gr2",
            id_eng: "august_eng2",
            month: "Αύγουστος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "september_gr2",
            id_eng: "september_eng2",
            month: "Σεπτέμβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "october_gr2",
            id_eng: "october_eng2",
            month: "Οκτόβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "november_gr2",
            id_eng: "november_eng2",
            month: "Νοέμβριος"
          },
          {
            text_gr:"", 
            text_eng:"",
             id_gr: "december_gr2",
            id_eng: "december_eng2",
            month: "Δεκέμβριος"
          }
        ]
      };
      Tips.insert(tip);
    }

    //it is now defined by the user.
    var emaildata = emailInfo.findOne();
    if (emaildata) {
      process.env.MAIL_URL="smtp://" + encodeURIComponent(emaildata.email) + ":"+ encodeURIComponent(emaildata.pass) + "@smtp.gmail.com:587";
    }
    

    var env;
    // Pick Braintree environment based on environment defined in Meteor settings.
    if ("Sandbox" === 'Production') {
      env = Braintree.Environment.Production;
    } else {
      env = Braintree.Environment.Sandbox;
    }
    // Initialize Braintree connection:
    gateway = BrainTreeConnect({
      environment: env,
      publicKey: "dcjsqqzg28j2dydg",
      privateKey: "b5aa2c17656e3c12f60f746d42d444f6",
      merchantId: "tk2dqtnpkmt66686"
    });
  });

Meteor.methods({
    getClientToken: function (clientId) {
      var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
      var options = {};

      if (clientId) {
        options.clientId = clientId;
      }

      var response = generateToken(options);
      return response.clientToken;
    },
    createTransaction: function(nonceFromTheClient,amount) {
      // Let's create transaction.
      gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
        options: {
          submitForSettlement: true, // Payment is submitted for settlement immediatelly
        }
      }, function (err, success) {
        if (err) { 
          console.log(err);
        }
        else {
          console.log(success);
        }
      });
    }
});
