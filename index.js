const express = require('express');
const db = require('./data/db')

const server = express();

server.use(express.json());

server.post('/users', (req, res) => {
  const user = req.body
  console.log(user)
  // const {bio, name} = req.body
  if (!user.bio || !user.name) {
    res.status(400).json({msg: "name and bio are required"})
  } else {
    db.insert(user)
      .then(newUser => {
        db.findById(newUser.id)
          .then(resp => res.status(201).json(resp))
      })
      .catch(err => res.status(500).json({errMsg: "error adding user"}))
  }
})

server.get('/users/:id', (req, res) => {
  const id = req.params.id
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({msg: "user not found"})
      }
    })
    .catch(err => res.status(500).json({errMsg: "error getting user"}))
});

server.get('/users', (req, res) => {
  db.find()
    .then(resp => res.status(200).json(resp))
    .catch(err => res.status(500))
})

server.delete('/users/:id', (req, res) => {
  let id = req.params.id
  removedUser = {}
  db.findById(id)
    .then(resp => removedUser = resp)
  db.remove(id)
    .then(deleted =>{
      if (deleted) {
        res.status(200).json(removedUser)
      } else {
        res.status(404).json({errMsg: "user not found"})
      }
    })
    .catch(err => res.status(500).json({errMsg: "error deleting user"}))
})

server.put('/users/:id', (req, res) => {
  const id = req.params.id
  const user = req.body

  if (!user.name || !user.bio) {
    res.status(400).json({errMsg: "name and bio are required"})
  } else {
    db.update(id, user)
      .then(resp => {
        if (resp) {
          db.findById(id)
            .then(updatedUser => res.status(200).json(updatedUser))
        } else {
          res.status(404).json({errMsg: "user not found"})
        }
      })
      .catch(err => res.status(500).json({errMsg: "error updating user"}))
  }
})


server.listen(3000, () => console.log('Running on port 3000'));
