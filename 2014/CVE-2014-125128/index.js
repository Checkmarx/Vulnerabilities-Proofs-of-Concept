const http = require('http');
const sanitizeHtml = require('sanitize-html');

const payload1 = '<a href="&#x6a;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3a;&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x27;&#x58;&#x53;&#x53;&#x20;&#x74;&#x72;&#x69;&#x67;&#x67;&#x65;&#x72;&#x65;&#x64;&#x21;&#x27;&#x29;">Hurry up! Click me!</a>';
const payload2 = '<a href="JAVASCRIPT:alert(\'XSS triggered!\')">Hurry up! Click me!</a>';
const payload3 = '<a href="jav&#x0A;ascript:alert(\'XSS triggered!\');">Hurry up! Click me!</a>';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
        "<p>"+sanitizeHtml(payload1)+"</p>" +
        "<p>"+sanitizeHtml(payload2)+"</p>" +
        "<p>"+sanitizeHtml(payload3)+"</p>"
    );
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
  