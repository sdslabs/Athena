import mongoose from 'mongoose'

export const connectDB = async () => {
  mongoose.set('strictQuery', false) // Why this? https://stackoverflow.com/questions/74747476/deprecationwarning-mongoose-the-strictquery-option-will-be-switched-back-to

  try {
    await mongoose.connect(process.env.MONGOURI || '')
    console.log('⚡️[server]: Connected to MongoDB')
  } catch (error) {
    console.log(error)
  }
}
