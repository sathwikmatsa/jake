chrome.runtime.onMessage.addListener(
  function(msg, sender, response) {
  	if(msg.from === 'popup'){
  		var inputText = window.getSelection().toString();
  		console.log(inputText);
  		response(inputText);
  	} 
  });