
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Article = require('./article');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://localhost:27017/pubmed'

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getArticle/count', (req, res) => {
  Article.countDocuments().exec((err, count) => {
    if (err) {
        res.send(err);
        return;
    }
    console.log("count is", count)
    return res.json({ count: count });
  });
})

// Search method
router.get('/searchArticle/:query', (req, res) => {
  console.log("request", req.params)
  //Article.find({$text: {$search: req.params.query}}, { score: { $meta: "textScore" } }, (err, articles) => {
  Article.find(
    { $text: { $search : req.params.query }},
    { score: { $meta: 'textScore'}}
  )
  //.sort({ score: { $meta : 'textScore' } })
  .exec((err, articles) => {
    console.log("execing - err: ", err)
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, articles: articles });
  });
});

// Search by subject/keyword
router.get('/searchKeyword/:query', (req, res) => {
  Article.find({ subjects: req.params.query }, (err, articles) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, articles: articles });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getArticle', (req, res) => {
  console.log("request", req.params)
  Article.find( (err, articles) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, articles: articles });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateArticle', (req, res) => {
  const { id, update } = req.body;
  Article.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteArticle', (req, res) => {
  const { id } = req.body;
  Article.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putArticle', (req, res) => {
  let article = new Article();

  const {
    id,
    title,
    journal,
    authors,
    pubDate,
    subjects,
    abstract,
    sourceFile,
  } = req.body;

  if ((!id && id !== 0) || !title) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  article.title = title;
  article.id = id;
  article.journal = journal;
  article.authors = authors;
  article.pubDate = pubDate;
  article.subjects = subjects;
  article.abstract = abstract;
  article.sourceFile = sourceFile;

  article.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));