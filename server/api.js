const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const express = require("express");
const { data } = require("jquery");

const conString = "mongodb://127.0.0.1:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/users', (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('users').find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        });    
    });
});

app.get('/appointments',(req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').find({}).toArray().then(document => {
            res.send(document);
            res.end();
        });
    });
});

app.get('/appointments/:id', (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').findOne({appointment_id:parseInt(req.params.id)}).then(document => {
            res.send(document);
            res.end();
        });
    });
});

app.post('/register-user',(req, res) => {
    var user = {
        userid:req.body.userid,
        password:req.body.password,
        email:req.body.email
    }

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('users').insertOne(user).then(() => {
            console.log('User Registered');
            res.end();
        });
    });
});

app.post('/add-appointment',(req, res) => {
    var appointment = {
        appointment_id:parseInt(req.body.appointment_id),
        title:req.body.title,
        description:req.body.description,
        date:new Date(req.body.date),
        userid:req.body.userid
    };

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').insertOne(appointment).then(() => {
            console.log('Appointment Added');
            res.end();
        });
    });
});

app.put('/edit-appointment/:id',(req, res) => {
    var id = parseInt(req.params.id);

    var appointment = {
        appointment_id:parseInt(req.body.appointment_id),
        title:req.body.title,
        description:req.body.description,
        date:new Date(req.body.date),
        userid:req.body.userid
    };

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').updateOne({appointment_id:id},{$set:appointment}).then(() => {
            console.log('Appointment Updated');
            res.end();
        });
    });
});

app.delete('/delete-appointment/:id',(req, res) => {
    var id = parseInt(req.params.id);

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').deleteOne({appointment_id:id}).then(() => {
            console.log('Appointment Deleted');
            res.end();
        });
    });
});

app.listen(4040);
console.log(`Server Started http://127.0.0.1:4040`);