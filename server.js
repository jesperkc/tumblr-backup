const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");
const tumblr = require('tumblr.js');

const filebuffer = fs.readFileSync("db/usda-nnd.sqlite3");

const olddb = new sqlite.Database(filebuffer);

const app = express();


var mongoose = require('mongoose');
mongoose.connect('mongodb://wanker:wankerpass@ds247327.mlab.com:47327/tmblr',{
    useMongoClient: true
  });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var client = tumblr.createClient({ consumer_key: 'izkbUMvtlqrbCwcuDsRZ81i4Moif9mDDpxn4c2z9LwCTgL0s6E', returnPromises: true });

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}



app.post('/addblogs', (req, res) => {
  let blogs = req.body.blogs;
  if (blogs.trim() != ''){
      blogs = blogs.split('\n');
      for (var i=0; i<blogs.length; i++){
          db.collection('blogs').update({ name: blogs[i] }, { name: blogs[i], latest_scrape: new Date().getTime() }, { upsert: true });
      }
  }
  db.collection('blogs').find( { $query: {}, $sort: { latest_scrape : 1 } }).toArray((a,b)=>{
      console.log(b);
  });
  //
  res.send('ok');
});

app.get('/backup/', async (req,res)=>{
  // Make the request
    console.log('backup');
    let posts = [];
    db.collection('blogs').find({}).sort({latest_scrape : 1}).limit(10).toArray((a,blogs)=>{
      console.log(blogs);
      for (var i=0; i<blogs.length; i++){
        backupLikes(blogs[i]);
        backupBlog(blogs[i]);
      }
    });
    
    res.send('');

});


app.get('/backup/like/', async (req,res)=>{
  backupLikes({
    latest_like: 0,
    name: 'neptaboolover'
  })    
  res.send('');
});



const backupLikes = (b) => {
  let latest_id = b ? b.latest_like : 0;
  // await
  client.blogLikes(b.name + '.tumblr.com')
      .then((data) => {
          console.log('blog likes',b.name);
          let a = [];
          if (data){
            if (data.liked_posts.length){
              db.collection('blogs').update(
                  { name: b.name },
                  { $set: {
                      latest_like: data.liked_posts[0].id,
                    }
                  }
              )
            }
              a = data.liked_posts.filter((post)=>{
                console.log(latest_id, post.id);
                  if (post.id > latest_id || !latest_id){
                    console.log('Insert', post);
                      db.collection('posts').update(
                        {id: post.id},
                        post,
                        { upsert: true }
                      )
                  }
                      
                  return true;//post.type == 'link' || post.type == 'text' ? true : false;
              })
          }
          return a;
      }).catch(function(err) {
          console.log(err);
          db.collection('blogs').remove({ name: b.name })
          return err;
      });
}


const backupBlog = (b) => {
  let latest_id = b ? b.latest : 0;
  // await
  client.blogPosts(b.name + '.tumblr.com')
      .then((data) => {
          console.log('blog',b.name);
          db.collection('blogs').update(
              { name: b.name },
              {
                  $set: {latest_scrape: new Date().getTime()}
              }
          )
          //console.log(data.posts); // liked_posts
          let a = [];
          if (data){
            if (data.posts.length){
              db.collection('blogs').update(
                  { name: b.name },
                  {
                      name: b.name,
                      latest: data.posts[0].id,
                      latest_scrape: new Date().getTime()
                  }
              )
            }
              a = data.posts.filter((post)=>{
                console.log(latest_id, post.id);
                  if (post.id > latest_id || !latest_id){
                    console.log('Insert', post);
                      db.collection('posts').update(
                        {id: post.id},
                        post,
                        { upsert: true }
                      )
                  }
                      
                  return true;//post.type == 'link' || post.type == 'text' ? true : false;
              })
          }
          return a;
      }).catch(function(err) {
          console.log(err);
          db.collection('blogs').remove({ name: b.name })
          return err;
      });
}




app.get('/posts/', async (req,res)=>{
  //{type: 'link', type: 'text'}
  await db.collection('posts').find({date: {$gte: "2018-01-12 00:00:00 GMT"}}, {sort: { date : -1 }, limit: 400}).toArray((a,b)=>{
      res.send(b);
  });
});



const COLUMNS = [
  "carbohydrate_g",
  "protein_g",
  "fa_sat_g",
  "fa_mono_g",
  "fa_poly_g",
  "kcal",
  "description"
];
app.get("/api/food", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = olddb.exec(
    `
    select ${COLUMNS.join(", ")} from entries
    where description like '%${param}%'
    limit 100
  `
  );

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (parseFloat(e.fat_g, 10) +
              parseFloat(entry[idx], 10)).toFixed(2);
          } else {
            e[c] = entry[idx];
          }
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
