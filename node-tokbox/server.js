var express = require('express'),
    OpenTok = require('opentok'),
    path = require('path'),
    app = express(),
    PORT = process.env.PORT || 8080;

var API_KEY = '45570252';
var API_SECRET = '9365ed6d5081f905e221f9d4e038d94ffd739b7e';
var sessions = {};

var tok = new OpenTok(API_KEY, API_SECRET);

var generateSession = function generateSession(req, res) {
  tok.createSession(function(err, session) {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }

    // save the sessionId
    sessions[session.sessionId] = session;
    var token = session.generateToken({data: 'name=Timmy'});

    res.json({
      apikey: API_KEY,
      sessionId: session.sessionId,
      token: token
    });
  });
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/session', generateSession);

app.listen(PORT, () => {
  console.log('running on localhost:' + PORT);
});