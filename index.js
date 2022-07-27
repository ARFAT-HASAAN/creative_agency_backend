const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const cors = require('cors')
const app = express()
const { ServerApiVersion } = require('mongodb')
const fileUpload = require('express-fileupload')
const { json } = require('express')
require('dotenv').config()

const port = 5000
app.use(cors())
app.use(express.json())
app.use(fileUpload())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.oq9xl.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const database = client.db('Creative_Agency')
    const ServiceCollection = database.collection('ServiceCollection')
    const OrderedCollection = database.collection('OrderedCollection')
    const UserCollection = database.collection('UserCollection')
    const ReviewCollection = database.collection('ReviewCollection')

    // post services
    app.post('/services', async (req, res) => {
      const services = req.body
      const filedata = req.files.images.data
      const picEncoded = filedata.toString('base64')
      const picture = Buffer.from(picEncoded, 'base64')
      const NewService = { ...services, picture }
      // console.log(newServices)

      const result = await ServiceCollection.insertOne(NewService)

      res.send(result)
    })

    app.get('/services', async (req, res) => {
      const result = await ServiceCollection.find().toArray()
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      console.log(req)
      const id = req.params?.id
      const query = {
        _id: ObjectId(id),
      }
      const result = await ServiceCollection.findOne(query)
      res.send(result)
    })

    // order service

    app.post('/order', async (req, res) => {
      const info = req.body

      const result = await OrderedCollection.insertOne(info)
      res.send(result)
    })

    app.get('/order', async (req, res) => {
      const result = await OrderedCollection.find().toArray()
      res.send(result)
    })

    app.put('/order', async (req, res) => {
      const id = req.query.id
      const state = req.query.state
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoct = {
        $set: {
          state: state,
        },
      }

      const result = await OrderedCollection.updateOne(
        filter,
        updateDoct,
        options,
      )

      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body

      console.log(user)
      const result = await UserCollection.insertOne(user)
      res.send(result)
      console.log(result)
    })

    app.get('/users', async (req, res) => {
      const result = await UserCollection.find().toArray()
      res.send(result)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params?.email
      console.log(req.params)
      const query = { email }
      if (!email) {
      } else {
        const result = await UserCollection.findOne(query)
        res.send(result)
      }
    })

    app.put('/users', async (req, res) => {
      const filter = req.body
      console.log(filter)
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          role: 'admin',
        },
      }
      // res.send('touch it')
      const result = await UserCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    app.post('/review', async (req, res) => {
      const Review = req.body
      console.log(Review)
      const result = await ReviewCollection.insertOne(Review)
      res.send(result)
    })

    app.get('/review', async (req, res) => {
      const result = await ReviewCollection.find().toArray()
      res.send(result)
    })
  } finally {
    // await client.close()
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('hello horld!!')
})

app.listen(port, () => {
  console.log('my port number is', port)
})
