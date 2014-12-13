var fs = require('fs');
var osa = require('osa');
var walk = require('walk').walk;
var execSync = require('exec-sync');

var user = execSync('whoami');

var ID_REGEX = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/

var DATA_FOLDER = '/Users/' + user + '/Library/Application Support/AddressBook';

var getPictureFromFile = function(id, cropped, cb) {
    var filename = id.match(ID_REGEX)[0];

    if(!cropped)
        filename += '.jpeg';

    var filepath = "";

    var walker = walk(DATA_FOLDER);

    walker.on('file', function(root, stats, next) {
        if(stats.name == filename) {
            filepath = root + '/' + stats.name;
            fs.readFile(filepath, function(err, data) {
                cb(err, data);
            });
        } else {
            next();
        }
    });

    walker.on('end', function() {
        if(!filepath) {
            cb('No image found!', undefined);
        }
    });
};

var Contacts = {};

Contacts.getContacts = function(filter, cb) {
    // Dear Apple
    // Why on earth did you not provide Array.map?
    // WHY!!!
    osa(function(filter) {
        var Contacts = Application('Contacts');
        var $found = Contacts.people.where(filter);
        var found  = [];

        for(var i=0; i<$found.length; i++) {
            var $contact = $found[i];
            var  contact = {};

            contact.id       = $contact.id();
            contact.first    = $contact.firstName();
            contact.last     = $contact.lastName();
            contact.nickname = $contact.nickname();

            var $addresses = $found.addresses;
            var  addresses = [];

            for(var a=0; a<$addresses.length; a++) {
                var $address = $addresses[a];
                addresses.push({
                    formattedAddress:   $address.formattedAddress(),

                    city:    $address.city()[0],
                    street:  $address.street()[0],
                    zip:     $address.zip()[0],
                    country: $address.country()[0],
                    state:   $address.state()[0]
                });
            }

            contact.addresses = addresses;

            var $phones = $found.phones;
            var  phones = [];

            for(var p=0; p<$phones.length; p++)
                phones.push($phones[p].value()[0]);

            contact.phones = phones;

            found.push(contact);
        }

        return found;
    }, filter, cb);
};

Contacts.getPicture = function(contact, cropped, cb) {
    var id = (typeof(contact)=="object")? contact.id : contact;
    getPictureFromFile(id, cropped, cb);
};

module.exports = Contacts;
