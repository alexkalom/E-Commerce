Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'firstname',
        fieldLabel: (Session.get("language") == "eng" ? 'First name' : 'Όνομα'),
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your first name");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'lastname',
        fieldLabel: (Session.get("language") == "eng"  ? 'Last name' : 'Έπίθετο'),
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your last name");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'address',
        fieldLabel: (Session.get("language") == "eng" ? 'Address' : 'Διεύθυνση'),
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your address");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'region',
        fieldLabel: (Session.get("language") == "eng" ? 'Region' : 'Περιοχή'),
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your region");
            return false;
          } else {
            return true;
          }
      }
    }, {
        fieldName: 'postalcode',
        fieldLabel: (Session.get("language") == "eng" ? 'Postal code': 'Ταχυδρομικός κώδικας'),
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your postal code");
            return false;
          } else {
            return true;
          }
        }
    }
    ]
});