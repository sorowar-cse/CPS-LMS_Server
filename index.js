

const express = require('express')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000
// middle ware
app.use(cors())
app.use(express.json())
// Traveling-app-fifth
// mJpFypko0n6xvgzy

const uri = "mongodb+srv://cps-lms:cps-lms3241@cluster0.6wtrm1x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const database = client.db('CPS-LMS')
    const courseCollection = database.collection('courses')
    console.log('database connected')
    // send courses to the database
    app.post('/courses', async (req, res) => {
      const course = req.body
      const result = await courseCollection.insertOne(course)
      console.log(result)
      res.json(result)
    })

    // update data into products collection
    app.put('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      console.log('updating', id)
      const updatedcourse = req.body
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          name: updatedcourse.name,
          price: updatedcourse.price,
          duration: updatedcourse.duration,
          img: updatedcourse.img,
        },
      }
      const result = await courseCollection.updateOne(
        filter,
        updateDoc,
        options,
      )
      console.log('updating', id)
      res.json(result)
    })

    // get all courses
    app.get('/courses', async (req, res) => {
      const cursor = courseCollection.find({})
      const course = await cursor.toArray()
      res.send(course)
    })

    // get a single course from course collection
    app.get('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: ObjectId(id) }
      const course = await courseCollection.findOne(query)
      res.json(course)
    })

    // delete a data from course collection
    app.delete('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: new ObjectId(id) }
      const result = await courseCollection.deleteOne(query)
      res.json('result')
    })
  } finally {
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('CPS-LMS is Running...')
})

app.listen(port, () => {
  console.log(`CPS-LMS  on port ${port}`)
})