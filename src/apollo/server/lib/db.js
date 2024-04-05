import mongoose from 'mongoose'

// const connection = {};

let DB = process.env.DB

const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    console.log('not connected')
    await mongoose
      .connect(
        'mongodb+srv://husnain:husnain123@dt-cluster0.cbii4.mongodb.net/procat360_production?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      )
      .then(() => console.log('db connected successfully'))
      .catch(err => console.log('db connection Error = ', err))
  }

  return handler(req, res)
}

const db = mongoose.connection
db.once('ready', () => console.log(`connected to mongo on ${DB}`))

export default connectDB
