var express = require('express'),
    twilio = require('twilio'),
    path = require('path'),
    app = express(),
    PORT = process.env.PORT || 8080;

// for demo go to https://www.twilio.com/user/account/video/dev-tools/testing-tools and generate a new token using the identity below and paste it in the response
const generateToken = (req, res) => {
  // verify and return identity
  var identity,
      token;

  if (req.params.participant === 'caller') {
    identity = 'caller';
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2EwNTcyZWJmYmFlMjQxMmQ0ZmFmNzViODg4YWEzYzcyLTE0NjExNjk5MjMiLCJpc3MiOiJTS2EwNTcyZWJmYmFlMjQxMmQ0ZmFmNzViODg4YWEzYzcyIiwic3ViIjoiQUNlMzA3YjVhZDZjZDRlNmRiMmFhNGMwZjMyNDhlYzA5YiIsImV4cCI6MTQ2MTE3MzUyMywiZ3JhbnRzIjp7ImlkZW50aXR5IjoiY2FsbGVyIiwicnRjIjp7ImNvbmZpZ3VyYXRpb25fcHJvZmlsZV9zaWQiOiJWU2YzOWU4ZDMzMjMxYjc0OWEyNWZmNTEzYmI1MDkyNWFiIn19fQ.N-_uUl2-b0H6d8758PEa3mdy5cpkN0JWFx3xLMfYPc0';
  }

  if (req.params.participant === 'callee') {
    identity = 'callee';
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2EwNTcyZWJmYmFlMjQxMmQ0ZmFmNzViODg4YWEzYzcyLTE0NjExNjk5MzYiLCJpc3MiOiJTS2EwNTcyZWJmYmFlMjQxMmQ0ZmFmNzViODg4YWEzYzcyIiwic3ViIjoiQUNlMzA3YjVhZDZjZDRlNmRiMmFhNGMwZjMyNDhlYzA5YiIsImV4cCI6MTQ2MTE3MzUzNiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiY2FsbGVlIiwicnRjIjp7ImNvbmZpZ3VyYXRpb25fcHJvZmlsZV9zaWQiOiJWU2YzOWU4ZDMzMjMxYjc0OWEyNWZmNTEzYmI1MDkyNWFiIn19fQ.MRE9Ayvn645xZa5yUa8db2v9WgjoZR0dDCbALCwkL1s';
  }

  // generate the access token using our API deets
  // const token = new AccessToken(
  //     process.env.TWILIO_ACCOUNT_SID,
  //     process.env.TWILIO_API_KEY,
  //     process.env.TWILIO_API_SECRET
  // );

  //assign the generated identity to the token
  // token.identity = identity;

  // grant the access token Twilio Video capabilities
  // var grant = new ConversationsGrant();
  // grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;

  // token.addGrant(grant);
  // token.toJwt()

  // Serialize the token to a JWT string and include it in a JSON response
  res.send({
      identity: identity,
      token: token
  });
};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/caller', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/callee', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/token/:participant', generateToken);

app.listen(PORT, () => {
  console.log('running on localhost:' + PORT);
});