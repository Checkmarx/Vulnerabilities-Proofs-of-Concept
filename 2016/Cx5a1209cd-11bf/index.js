const express = require('express');
const Sequelize = require('sequelize');
var path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    birthday: {
        type: Sequelize.DATE
    },
    password: {
        type: Sequelize.STRING
    }
});

async function runDB() {
    await User.sync({ force: true }).then(function () {
        User.create({
            id: 1,
            username: 'test1',
            birthday: new Date(1980, 6, 20),
            password: "somepassword"
        });
        User.create({
            id: 2,
            username: 'test2',
            birthday: new Date(1981, 6, 20),
            password: "anotherpassword"
        });
        User.create({
            id: 3,
            username: 'johndoe',
            birthday: new Date(1981, 6, 20),
            password: "differentpassword"
        });
    });
}

runDB();



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/search', function (req, res) {
    User.findAll({
        where: { username: req.body.username },
        limit: req.body.limit,
        //offset: req.body.offset
    }).then(function (users) {
        res.json(users.length);
    }).catch(function (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while searching.' });
    });
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});