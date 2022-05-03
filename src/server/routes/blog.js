var express = require('express');
var router = express.Router();
const slugify = require('slugify');
var config = require('../../config.json');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'public', 'blog', 'banner'));
  },
  filename: function(req, file, cb) {
    cb(null, req.body.fileName);
  }
});
const upload = multer({ storage: storage});

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function getCombinations(valuesArray) {
  var combi = [];
  var temp = [];
  var slent = Math.pow(2, valuesArray.length);

  for (var i = 0; i < slent; i++) {
    temp = [];
    for (var j = 0; j < valuesArray.length; j++) {
      if ((i & Math.pow(2, j))) {
        temp.push(valuesArray[j]);
      }
    }
    if (temp.length > 0) {
      combi.push(temp);
    }
}

combi.sort((a, b) => a.length - b.length);
return combi;
}
/*
Special thanks to
https://stackoverflow.com/users/1940394/david
https://stackoverflow.com/users/6145207/overlord1234
https://stackoverflow.com/users/3175960/jxdarkangel
*/

module.exports = function(conn) {
  function checkAuth(user, pass) {
    console.log(user, pass);
    return config.admins.some((x) => x.user === user && x.pass === pass);
  }
  router.get('/post', async function(req, res, next) {
    if(typeof req.query.id === "undefined") {
      res.status(422);
      return res.end();
    }
    var [rows] = await conn.execute('SELECT * FROM posts WHERE id = ?', [req.query.id]);
    if(rows.length > 0) {
      res.json(rows);
      res.status(200);
      return res.end();
    }else {
      res.status(400);
      return res.end();
    }
  });
  router.get('/search/', async function(req, res) {
    if(typeof req.query.query === "undefined") {
      res.status(422);
      return res.end();
    }
    var [rows] = await conn.execute('SELECT * FROM posts');
    var result = [];
    for(var i = 0; i < rows.length; i++) {
      var title = rows[i].title;
      var words = title.split(' ');
      var combs = getCombinations(words);
      for(var j = 0; j < combs.length; j++) {
        if(similarity(typeof combs[j] === "string" ? combs[j] : combs[j][0], req.query.query) > 0.4) {
          result.push(rows[i]);
          break;
        }
      }
    }
    if(result.length == 0) {
      res.status(204);
    }
    res.json(result).status(200);
  });
  router.get('/posts', async function(req, res, next) {
    var [rows] = await conn.execute('SELECT * FROM posts');
    res.json(rows);
    return res.status(200);
  });
  router.post('/newPost', async function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      res.end();
    }else {
      if(!["title", "description", "content", "date", "tags"].every(x => Object.keys(req.body).includes(x))) {
        res.status(422);
        return res.end();
      }else {
        var s = slugify(req.body.title, {
          replacement: '_',
          remove: /[|<|>|{|}|"|/|||;|:|.|,|~|!|?|@|#|$|%|^|=|&|*|\\|]|\\|\\|(|)|\\|[|¿|§|«|»|ω|⊙|¤|°|℃|℉|€|¥|£|¢|¡|®|©|0|-|9|_|+]/g,
          lower: true
        });
        console.log('ok.');
        await conn.execute(`INSERT INTO posts (title, date, description, content, tags, short_url, views, author, banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.title, req.body.date ,req.body.description, req.body.content, req.body.tags, s, 0, req.session.user, req.body.bannerFileName]);
        res.json({ message: 'ok.' });
      }
    }
  });
  router.post('/removePost', async function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      return res.end();
    }
    if(typeof req.body.id === "undefined") {
      res.status(422);
      return res.end();
    }
    var [rows] = await conn.execute('SELECT * FROM posts WHERE id = ?', [req.body.id]);
    if(rows.length > 0) {
        await conn.execute('DELETE FROM posts WHERE id = ?', [req.body.id]);
        res.status(200);
        return res.end();
    }else {
      res.status(400);
      return res.end();
    }
  });
  router.post('/updatePost', async function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      return res.end();
    }
    if(typeof req.body.id === "undefined" || typeof req.body.property === "undefined" || typeof req.body.value === "undefined") {
      res.status(422);
      return res.end();
    }
    var [rows] = await conn.execute('SELECT * FROM posts WHERE id = ?', [req.body.id]);
    if(rows.length > 0) {
        await conn.execute('UPDATE posts SET ' + req.body.property + ' = ? WHERE ID = ?', [req.body.value ,req.body.id]);
        res.status(200);
        return res.end();
    }else {
      res.status(400);
      return res.end();
    }
  });
  router.post('/uploadBanner', upload.single('image'), async function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      return res.end();
    }
    if(typeof req.body.fileName === "undefined" || typeof req.file === "undefined") {
      res.status(422);
      return res.end();
    }
    console.log(req.file);
    res.status(200);
    res.end();
  });
  router.post('/removeBanner', function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      return res.end();
    }
    if(typeof req.body.fileName === "undefined") {
      res.status(422);
      return res.end();
    }
    if(!fs.existsSync(path.join(__dirname, '..', '..', 'public', 'blog', 'banner', req.body.fileName))) {
      res.status(400);
      return res.end();
    }
    console.log("hi");
    fs.unlinkSync(path.join(__dirname, '..', '..', 'public', 'blog', 'banner', req.body.fileName));
    res.status(200).end();
  });
  router.get('/getBanners', async function(req, res, next) {
    res.json(fs.readdirSync(path.join(__dirname, '..', '..', 'public', 'blog', 'banner'))).status(200).end();
  });
  router.post('/authorize', async function(req, res, next) {
    if(typeof req.session.cooldown !== "undefined" && ((new Date().getTime() - req.session.cooldown) < 3000)) {
      res.status(429);
      return res.end();
    }
    if(typeof req.body.user === "undefined" || typeof req.body.pass === "undefined" || req.body.user === '' || req.body.pass === '') {
      res.status(422);
      return res.end();
    }
    req.session.user = req.body.user;
    req.session.pass = req.body.pass;
    req.session.cooldown = new Date().getTime();
    res.json({message: 'ok.'})
  });
  router.post('/test', async function(req, res, next) {
    if(!checkAuth(req.session.user, req.session.pass)) {
      res.status(401);
      res.end();
    }else {
      res.send('ok.');
    }
  });
  return router;
}