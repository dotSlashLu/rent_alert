var _ = require("underscore"),
    fs = require("fs"),
    http = require("superagent"),
    moment = require("moment"),
    Promise = require("bluebird");

var conf = require("./config"),
    sendMail = require("./init").sendMail;


function check() {
  var max_id = parseInt(fs.readFileSync("./max_id").toString("utf8"));
  console.log("[" + moment().format("YY-MM-DD HH:mm:ss") + 
      "] Start checking from " + max_id);

  http.getAsync(conf.url)
  .then(function(res) {
    var tids = [],
        text = res.text, 
        entries = text.match(/<a class="listTitle".*?<\/a>/g),
        hasNew = false,
        mailCtnt = "<html><body><ul>";
  
    _.each(entries, function(ent){
      var parts = ent.match(/href="(.*?)".*?>(.*?)<\/a>/),
          link = "http://home.meizu.cn/" + parts[1].replace(/&amp;/g, "&"),
          tid = link.match(/tid\=(\d+)/)[1],
          title = parts[2];
      
      tids.push(parseInt(tid));

      if (tid > max_id && conf.predicate(title)) {
        hasNew = true;
        console.log(title + " matched");
        mailCtnt += "<li><a href='" + link + "'>" + title + "</a>";
      }
    })
  
    console.log("Got tids: " + tids.join(","));
    fs.writeFile("max_id", _.max(tids));
    if (hasNew) {
      mailCtnt += "</ul></body></html>";
      return sendMail(mailCtnt);
    }
  })
  
  .delay(conf.interval * 1000)

  .then(function() {
    check();
  })

  .catch(function(err) {
    console.error(err)
  });
}

check();
