osa-contacts
===

![](https://img.shields.io/npm/dm/osa-contacts.svg)
![](https://img.shields.io/npm/v/osa-contacts.svg)
![](https://img.shields.io/npm/l/osa-contacts.svg)

A node.js module to access contact information on OSX

Installation
===

**Requires OSX 10.10 Yosemite.**

```bash
npm install osa-contacts
```

Usage
====

###*Get info about a contact*

```js
var contacts = require('osa-contacts');

// First param: query object (see below)
contacts.getContacts({ name: 'Johnny Appleseed' }, function(err, data) {
    // Data is an array of contact objects (see below)
});
```

The query object contains requirements for a contact to be returned.
All conditions must be met for the contact to be returned.

**Example query objects:**

```js
// Person with the name 'Johnny Appleseed'
{
    'name': 'Johnny Appleseed'
}

// People with the first name 'Alice'
{
    'firstName': 'Alice'
}

// People with the last name 'Liddell'
{
    'lastName': 'Liddell'
}
```

**Example contact object:**

```js
{
    'id': 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX:ABPerson',
    'first': 'Johnny',
    'last': 'Appleseed',
    'nickname': null,
    'addresses': [
        {
            'city': 'Cupertino',
            'street': '1 Infinite Loop',
            'zip': '95014',
            'country': 'United States',
            'state': 'CA',
            'formattedAddress': '1 Infinite Loop\nCupertino CA 95014\nUnited States'
        }
    ],
    'phones': [
        '+1 (555) 555-5555'
    ]
}
```

###*Get a person's contact photo*

```js
var contacts = require('osa-contacts');

contacts.getContacts({ name: 'Johnny Appleseed' }, function(err, data) {
    var john = data[0];

    // First param  - contact object or string id
    // Second param - if true, getPicture will return the cropped version
    contacts.getPicture(john, true, function(err, data) {
        // Data is a Buffer of the JPG image file
    });
});
```
