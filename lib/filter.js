'use strict';

var replacementMethod = 'stars';
var grawlixChars = ['!','@','#','$','%','&','*'];
var dictionary = {};

var replacement = {
  stars: function (key) {
    var keyReplacement = '', i, len;

    for (i = 0, len = key.length; i < len; i++) {
      keyReplacement += '*';
    }

    return keyReplacement;
  },
  word: function (key) {
    return dictionary[key];
  },
  grawlix: function (key) {
    var keyReplacement = '',
      grawlixLen = grawlixChars.length,
      wordLen = key.length,
      rand,
      i;

    for (i = 0; i < wordLen; i++) {
      rand = Math.floor(Math.random() * grawlixLen);
      keyReplacement += grawlixChars[rand];
    }

    return keyReplacement;
  }
};

var compare = function(omsg, msg) {
  var oMsgArr = omsg.split(' '),
    msgArr = msg.split(' ');
  for(var i=0; i<msgArr.length; i++) {
    if(msgArr[i] !== oMsgArr[i].toLowerCase) {
      oMsgArr[i] = msgArr[i];
    }
  }
  return oMsgArr.join(' ');
};

module.exports = {

  /**
   * Clean the supplied string of all words in the internal dictionary
   * @method clean
   * @param  {String} string The phrase to be cleaned
   * @return {String}        The phrase with all words in the dictionary filtered
   */
  clean: function (string) {
    var key, keyReplacement, lKey;
    var lString = string.toLocaleLowerCase();

    // loop through each key in the dictionary and search for matches
    // (seems like it'd be faster to indexOf on all keys and run replace on matches, rather than replace all)
    for (key in dictionary) {
      lKey = key.toLowerCase();
      if (lString.indexOf(lKey) !== -1) {
        keyReplacement = replacement[replacementMethod](key);
        lString = lString.replace(lKey, keyReplacement);
      }
    }

    return compare(string, lString);
  },

  /**
   * Populate the dictionary with words
   * @method seed
   * @param  {Object|String} name Either an object containing all dictionary key/values or the name of a preset seed data file
   */
  seed: function (name) {
    if (typeof name === 'object') {
      dictionary = name;
    } else {
      try {
        dictionary = require('./seeds/' + name);
      } catch (err) {
        console.warn('Couldn\'t load profanity filter seed file: ' + name, err);
      }
    }
    
    return this;
  },

  /**
   * Set the method of replacement for the clean() method
   * @method setReplacementMethod
   * @param {String} method The replacement method (stars, grawlix, word)
   */
  setReplacementMethod: function (method) {
    if (typeof replacement[method] === 'undefined') {
      throw 'Replacement method "' + method + '" not valid.';
    }
    replacementMethod = method;
    
    return this;
  },

  /**
   * Set the characters to be used for grawlix filtering
   * @setGrawlixChars
   * @param {Array} chars An array of strings that will be used at random for grawlix filtering
   */
  setGrawlixChars: function (chars) {
    grawlixChars = chars;
    
    return this;
  },

  /**
   * Adds a word to the dictionary
   * @method addWord
   * @param {String} word          The word to search for during clean()
   * @param {String} [replacement] The string to replace the unallowed word, if the 'word' replacementMethod is being used
   */
  addWord: function (word, replacement) {
    dictionary[word] = replacement || 'BLEEP';
    
    return this;
  },

  /**
   * Remove a word from the dictionary
   * @method removeWord
   * @param  {String} word The word to be removed
   */
  removeWord: function (word) {
    if (dictionary[word]) {
      delete dictionary[word];
    }
    
    return this;
  },

  /**
   * Obtain the internal dictionary, replacementMethod, and grawlixChars properties for debugging purposes
   * @method debug
   * @return {Object} The debugging data
   */
  debug: function () {
    return {
      dictionary: dictionary,
      replacementMethod: replacementMethod,
      grawlixChars: grawlixChars
    };
  }
};
