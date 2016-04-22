var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    AccessToken = require('twilio').AccessToken,
    ConversationsGrant = AccessToken.ConversationsGrant,
    path = require('path'),
    app = express(),
    PORT = process.env.PORT || 8080;

const TWILIO_ACCOUNT_SID = 'ACd0495e56006c904bc1ace279a6d9df8c';
const TWILIO_CONFIGURATION_SID = 'VS40d6ed44a600307ba85d3c44043e7be5';
const TWILIO_API_KEY = 'SKd62f8efc3cef1e90bde88e24f748cd92';
const TWILIO_API_SECRET = '58RnjVq2zjlTO2wfU1YxqpHKSB8RGlPu';

// for demo go to https://www.twilio.com/user/account/video/dev-tools/testing-tools and generate a new token using the identity below and paste it in the response
const generateToken = (req, res) => {

  // verify and return identity
  var identity = req.params.participant;

  // generate the access token using our API deets
  const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET
  );

  //assign the generated identity to the token
  token.identity = identity;

  // grant the access token Twilio Video capabilities
  var grant = new ConversationsGrant();
  grant.configurationProfileSid = TWILIO_CONFIGURATION_SID;

  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response
  res.send({
    identity: identity,
    token: token.toJwt()
  });
};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/token/:participant', generateToken);


var httpsOptions = {
  cert: fs.readFileSync(process.env.HOME + '/.localhost-ssl/cert.pem'),
  key: fs.readFileSync(process.env.HOME + '/.localhost-ssl/key.pem')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('https server on port:', PORT);
});
