const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myDatabase';
const collectionName = 'users';

// Configure Handlebars as the template engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Sign-in route
app.get('/signin', (req, res) => {
  res.render('signin');
});

// Sign-in form submission
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return res.status(500).send('Internal Server Error');
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.insertOne({ username, password }, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('User signed in successfully');
      client.close();
      res.redirect('/login');
    });
  });
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return res.status(500).send('Internal Server Error');
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.findOne({ username, password }, (err, result) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (result) {
        console.log('User logged in successfully');
        client.close();
        return res.send('Login successful');
      } else {
        console.log('Invalid username or password');
        client.close();
        return res.send('Invalid username or password');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
