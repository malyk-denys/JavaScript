(function () {
  var names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];

  for (var i = 0; i < names.length; i++) {
    var firstLetter = names[i].charAt(0).toLowerCase();

    if (firstLetter === "j") {
      byeSpeaker.speak(names[i]);
    } else {
      helloSpeaker.speak(names[i]);
    }
  }

  console.log("----- Додатковий функціонал -----");
  console.log("Правило: якщо ім'я закінчується на голосну (a, e, i, o, u, y), виводимо Hello, інакше - Good Bye.");

  for (var j = 0; j < names.length; j++) {
    var lastLetter = names[j].charAt(names[j].length - 1).toLowerCase();

    if ("aeiouy".indexOf(lastLetter) !== -1) {
      helloSpeaker.speak(names[j]);
    } else {
      byeSpeaker.speak(names[j]);
    }
  }
})();
