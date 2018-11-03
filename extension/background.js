'use strict';

chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript({
        file: 'contentScript.js'
    });
});