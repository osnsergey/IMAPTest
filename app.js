var imaps = require('imap-simple');

const user     = process.argv[2];
const password = process.argv[3];
const host     = 'imap.gmail.com'
const port     = 993
 
var config = {
    imap: {
        user: user,
        password: password,
        host: host,       
        "tlsOptions": { "servername": host },
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

imaps.connect(config).then(function (connection) {
 
    return connection.openBox('INBOX').then(function () {
        var searchCriteria = [
            'UNSEEN'
        ];
 
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
 
        return connection.search(searchCriteria, fetchOptions).then(function (results) {
            var subjects = results.map(function (res) {
                return res.parts.filter(function (part) {
                    return part.which === 'HEADER';
                })[0].body.subject[0];
            });
 
            console.log(subjects);
            // =>
            //   [ 'Hey Chad, long time no see!',
            //     'Your amazon.com monthly statement',
            //     'Hacker Newsletter Issue #445' ]
        });
    });
});