const http = require('http');
var sanitizeHtml = require('sanitize-html');

const payload1 = '<input value="&lt;script&gt;alert(\'XSS 1 triggered!\')&lt;/script&gt;">';
const payload2 = '<input value="<script>alert(\'XSS 2 triggered!\')</script>">';

const transformInput = (payload) => sanitizeHtml(
    payload,
    {
        allowedTags: [ 'u' ],
        allowedAttributes: { '*': ['class'] },
        transformTags: {
            input: function (tagName, attribs) {
                return {
                    tagName: 'u',
                    attribs: { class: 'inlined-input' },
                    text: attribs.value
                };
            }
        }
    }
);

const server = http.createServer((req, res) => {
    const transformedInput1 = transformInput(payload1);
    const transformedInput2 = transformInput(payload2);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
        "<p>"+transformedInput1+"</p>" +
        "<p>"+transformedInput2+"</p>"
    );
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});