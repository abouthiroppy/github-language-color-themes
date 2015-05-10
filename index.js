(function() {
  var yaml  = require ('js-yaml');
  var fs    = require ('fs');
  var https = require ('https');

  // url
  var url   = 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';
  var data  = '';

  https.get(url, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(yaml) {
      data += yaml;
    });
    res.on('end', function() {
      // yaml2object
      try {
        var languages = yaml.load(data);
        // to json
        convert2json(languages);
        // markdown
        convert2markdown(languages);

      } catch(e) {
        console.log(e);
      }

    });
  }).on('error', function(err) {
    console.log('error: ', err);
    return;
  });

  var convert2json = function(languages) {
    var json = JSON.stringify(languages, null, "  ");
    fs.writeFile('languages.json', json , function (err) {
      console.log(err);
    });
  }

  var convert2markdown = function(languages) {
    var colorLanguages   = '';
    var noColorLanguages = '';

    for (var languageName in languages) {
      // no color
      if (languages[languageName].color !== undefined) {
        var templete =
          '### <font color=' + languages[languageName].color + '>'+ languageName +'</font>' + '  \n' +
          '<font color=' + languages[languageName].color + '>'+ languages[languageName].color +'</font>  \n\n';
          colorLanguages += templete;
      }
      else {
        if (noColorLanguages === '') {
          noColorLanguages += '\n## no color\n';
        }
        noColorLanguages += languageName + '  \n';
      }
    }

    resultString = colorLanguages + noColorLanguages;
    fs.writeFile('languages.md', resultString, function(err) {
      console.log(err);
    });
  }

})();
