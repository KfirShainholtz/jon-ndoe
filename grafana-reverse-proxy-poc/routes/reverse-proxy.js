var _ = require('lodash');
var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

const grafanaServer = 'http://localhost:3000';


const crypto = require('crypto');

app.all("/*", function (req, res) {
    const sha1Key = createToken(req);
    req.headers['X-WEBAUTH-USER'] = sha1Key;

    // remove this
    // const grafanaServices = new GrafanaServices();
    // const user = {name: sha1Key, company: "LogzIO"};
    // const userData = grafanaServices.createUser(user);
    // const [orgApiKey, orgId] = grafanaServices.createOrganization(user);
    // const updatedUser = grafanaServices.updateUser(user.name, orgApiKey, orgd);

    if (req.url.indexOf('msearch')) {
        console.log(req.body);
    }
    apiProxy.web(req, res, { target: grafanaServer });
});

const createToken = (req) => {
    // the actual create token will be sent to services,
    // fetching the user id by his tokens (jwt, auth token or anything else)
    var authToken = req.cookies['logz-authToken-local'];
    if (!authToken) throw new Error();
    
    const hash = crypto.createHash('sha1');
    const salt = "s4uc3"; // too MUCH sauce

    hash.update(`${authToken}${salt}`);
    const sha1Key = hash.digest('hex');
    return sha1Key;
}

module.exports = app;