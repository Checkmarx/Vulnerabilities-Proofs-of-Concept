const validator = require('validator');
const fs = require("fs");

fs.readFile("base64_payload.txt", "utf8", (err, data) => {
    validator.isBase64(data);
});
