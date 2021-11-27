const loginControl = (request, response) => {
    const clientServices = require('../services/clientServices');

    let username = request.body.username;
    let password = request.body.password;
    if (!username || !password) {
        // response.send('login failed');
        // response.end();
        let reply = "Login Failed";
        response.render('afterLoginF', {user: reply});
    } else {
        if (request.session && request.session.user) {
            let reply = "Already logged in";
            response.render('afterLoginF', {user: reply});
        } else {
            clientServices.loginService(username, password, function(err, dberr, client) {
                console.log("Client from login service :" + JSON.stringify(client));
                if (client === null) {
                    console.log("Authentication problem!");
                    let reply = 'Login Failed.';
                    response.render('afterLoginF', {user: reply});
                } else {
                    console.log("User from login service :" + client[0].num_client);
                    //add to session
                    request.session.user = username;
                    request.session.num_client = client[0].num_client;
                    if (request.session.user=="Masson") {
                        request.session.admin = true;
                    } else {
                        request.session.admin = false;
                    }
                    num_client_fromLogin = request.session.num_client;
                    response.render('afterLoginP', { user: client});
                    //response.render('contacts', { user: client});
                }
            });
        }
    }
};


const registerControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    const { Client } = require('../models/entities');

    let username = request.body.username;
    let password = request.body.password;
    let society = request.body.society;
    let contact = request.body.contact;
    let addres = request.body.addres;
    let zipcode = request.body.zipcode;
    let city = request.body.city;
    let phone = request.body.phone;
    let fax = request.body.fax;
    let max_outstanding = request.body.max_outstanding;
    let client = new Client(username, password, 0, society, contact, addres, zipcode, city, phone, fax, max_outstanding);

    clientServices.registerService(client, function(err, exists, insertedID) {
        console.log("User from register service :" + insertedID);
        if (exists) {
            console.log("Username taken!");
            //response.send(`registration failed. Username (${username}) already taken!`); //invite to register
            let reply = "registration failed. Username (" + username + ") already taken!";
            response.render("registerF", {user: reply});
        } else {
            client.num_client = insertedID;
            console.log(`Registration (${username}, ${insertedID}) successful!`);
            //response.send(`Successful registration ${client.contact} (ID.${client.num_client})!`);
            let reply = `Successful registration ` + client.contact + ` (ID.` + client.num_client + `)!`;
            response.render("registerP", {user: reply});
        }
        //response.end();
    });
};

const getClients = (request, response) => {
    const clientServices = require('../services/clientServices');
    if (request.session.admin==true) {
        clientServices.searchService(function(err, rows) {
            // response.json(rows);
            // response.end();
            console.log(JSON.stringify(rows));
            response.render("clients", {clients: rows});
        }); 
    } else {
        let reply = "Not An Admin";
        console.log(reply);
        response.render("clientsF", {clients: reply});
    }
};

const getClientByNumclient = (request, response) => {
    const clientServices = require('../services/clientServices');
    let num_client = request.session.num_client;
    if (num_client!=null) {
        clientServices.searchNumclientService(num_client, function(err, rows) {
            // response.json(rows);
            // response.end();
            response.render('contacts', {clients: rows});
        });
    } else {
        console.log("No logged in user");
        response.send("Please login first");
        response.end();
    }
};

const logout = (request, response) => {
    if (!request.session) {
        let reply = "Please log in first";
        response.render("logout", {user: reply});
    } else {
        let reply = "You have been logged out, " + request.session.user;
        request.session.destroy();
        response.render("logout", {user: reply});
    }
}

module.exports = {
    loginControl,
    registerControl,
    getClients,
    getClientByNumclient,
    logout
};
