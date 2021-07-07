$(function(){
  if ('speechSynthesis' in window)  // To check speech sysntesis is supported in browser or not
  {
    
    // To get supported voice list in browser & append to select list
    speechSynthesis.onvoiceschanged = function() {
      var $voicelist = $('#voices');

      if($voicelist.find('option').length == 0) {
        speechSynthesis.getVoices().forEach(function(voice, index) {
          var $option = $('<option>')
          .val(index)
          .html(voice.name + (voice.default ? ' (default)' :''));

          $voicelist.append($option);
        });
      }
    }

    // On speak button click below function is calling
    $('#speak').click(function(){
      
      var message = $('#message').val();  // To get message from textarea
      
      const messageParts = message.split(/<break[=0-9]*>/g);  //Regex to split the entered using <break>
      
      var timeDelay = "";
      if(messageParts.length>1)  // to check delay is added or not
      {
        timeDelay = message.match(/break[=0-9]*/g).toString().replace(/break=/g, "").split(",");  // To get time delay added in break
      }
      let currentIndex = 0;
      
      // TTS function which is called for each part of text
      const speak = (textToSpeak, timeToDelay) => {
        const msg = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();
        msg.voice = voices[$('#voices').val()];
        msg.rate = $('#rate').val();
        msg.pitch = $('#pitch').val();
        msg.volume = 1; // 0 to 1
        msg.text = textToSpeak;
        msg.onend = function() {
          currentIndex++;
          if (currentIndex < messageParts.length) {
            setTimeout(() => {
              speak(messageParts[currentIndex],timeDelay[currentIndex])
            }, timeToDelay)
          }
        };
        speechSynthesis.speak(msg);
      }
      
      speak(messageParts[0], timeDelay[0]);  // calling speak function
    });
    
  } else {
    alert("Your Browser does not support speech synthesis");
  }
});