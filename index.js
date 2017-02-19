var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// These fuckers aren't the normal width they break my monospace 😿
emojis = ['🐈','🐱','😹','😼','😿','😸','😽','😾','😻','😺','🙀'];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

function getSymbols(string) {
    var index = 0;
    var length = string.length;
    var output = [];
    for (; index < length - 1; ++index) {
        var charCode = string.charCodeAt(index);
        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
            charCode = string.charCodeAt(index + 1);
            if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
                output.push(string.slice(index, index + 2));
                ++index;
                continue;
            }
        }
        output.push(string.charAt(index));
    }
    output.push(string.charAt(index));
    return output;
}

emojionly = function(text) {
    var tmp = '';
    var tmp2 = getSymbols(text);
    var em = this.emojis + [' ','!','?','-'];
    tmp2.forEach(function(symbol) {
        if (em.indexOf(symbol) >= 0)
            tmp += symbol;
    });
    return tmp;
}

io.on('connection', function(socket) {
    console.log("Someone connected")
    socket.on('chat', function(msg) {
        if (emojionly(msg).trim() != '') {
            io.emit('chat', msg);
            console.log(msg);
        }
    });
});

http.listen(8000, function() {
    console.log('listening on *:8000');
});
