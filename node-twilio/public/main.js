(function () {
  console.log('Hello, world!');

  var twilioClient;
  var activeConversation;

  var previewVideo;
  var previewBtn = document.getElementById('preview-btn');
  var inviteTo = document.getElementById('invite-to');
  var inviteBtn = document.getElementById('invite-btn');

  var main = document.getElementById('media');
  var nameInput = document.getElementById('name');
  var username = document.getElementById('username');
  var start = document.getElementById('start');

  var requestToken = function requestToken(callback) {
    fetch('/token/'+username.value)
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(callback);
        }
      )
      .catch(function(err) {
        console.log('Fetch Error:', err);
      });
  };

  start.addEventListener('click', function (e) {
    if (!nameInput.value) return false;

    username.value = nameInput.value;
    main.style.cssText = 'display: block;';

    requestToken(function (credentials) {

      // Create an AccessManager to manage our Access Token
      var accessManager = new Twilio.AccessManager(credentials.token);

      // Create a Conversations Client and connect to Twilio's backend
      twilioClient = new Twilio.Conversations.Client(accessManager);
      twilioClient.listen().then(function() {
        console.log('Connected to Twilio as:', credentials.identity);

        twilioClient.on('invite', function (invite) {
          console.log('Incoming invite from: ' + invite.from);
          invite.accept().then(setupConversation);
        });
      }, function (error) {
        console.log('Could not connect to Twilio: ' + error.message);
      });
    });
  });

  var setupConversation = function setupConversation(conversation) {
    console.log('In an active Conversation');
    activeConversation = conversation;

    // draw local video, if not already previewing
    if (!previewVideo) {
      conversation.localMedia.attach('#local-media');
    }

    // when a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
      console.log("Participant '" + participant.identity + "' connected");
      participant.media.attach('#remote-media');
    });

    // when a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
      console.log("Participant '" + participant.identity + "' disconnected");
    });

    // when the conversation ends, stop capturing local video
    conversation.on('ended', function (conversation) {
      conversation.localMedia.stop();
      conversation.disconnect();
      activeConversation = null;
    });
  };

  inviteBtn.addEventListener('click', function (e) {
    var id = inviteTo.value;

    twilioClient.inviteToConversation(id).then(
      setupConversation,
      function(error) {
        console.log('Unable to connect to Conversation: ' +  error.message);
      }
    );
  });

  previewBtn.addEventListener('click', function () {
    if (!previewVideo) {
      previewVideo = new Twilio.Conversations.LocalMedia();

      Twilio.Conversations.getUserMedia().then(
        function (mediaStream) {
          previewVideo.addStream(mediaStream);
          previewVideo.attach('#local-media');
        },
        function (error) {
          console.error('Unable to access local media', error);
          console.log('Unable to access Camera and Microphone');
        }
      );
    };
  });



})();