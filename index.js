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
    osa(function(filter) {
        var Contacts = Application('Contacts');
        var found = Contacts.people.where(filter);

        var ret = [];

        for(var i=0; i<found.length; i++) {
            var contact = found[i];
            ret.push({
                id:       contact.id(),
                first:    contact.firstName(),
                last:     contact.lastName(),
                nickname: contact.nickname(),
            });
        }

        return ret;
    }, filter, cb);
};

Contacts.getPicture = function(contact, cropped, cb) {
    var id = (typeof(contact)=="object")? contact.id : contact;
    getPictureFromFile(id, cropped, cb);
};

module.exports = Contacts;
