(function () {
  console.log('Hello, world!');

  var credentials;

  var startBtn = document.getElementById('startBtn');

  var getCredentials = function getCredentials() {
    fetch('/session')
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function(data) {
            console.log(data);
            credentials = data;
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  };

  var startSession = function startSession() {
    var session = OT.initSession(credentials.apikey, credentials.sessionId)
      .on('streamCreated', function(event) {
        session.subscribe(event.stream);
      })
      .connect(credentials.token, function(error) {
        var publisher = OT.initPublisher();
        session.publish(publisher);
      });
  };

  document.addEventListener('DOMContentLoaded', getCredentials);

  startBtn.addEventListener('click', startSession);

})();