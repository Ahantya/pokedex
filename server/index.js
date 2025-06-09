import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import axios from 'axios' 

dotenv.config()
const app = express()

// idkwhat this is but middleware 
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('🟢 Connected to MongoDB!'))
.catch((err) => console.error('🔴 MongoDB connection error:', err))

// tests route
// brew services start mongodb/brew/mongodb-community
app.get('/', (req, res) => {
  res.send('Pokedex API is running 🧃')
})

// starts server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})



app.get('/api/pokemon', async (req, res) => {
    try {
      console.log('Fetching all Pokémon! 🥒✨')
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
      const pokemonList = response.data.results
      console.log('Here’s the list, snuggle bug ➡️', pokemonList)
      res.json(pokemonList)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error fetching Pokémon data' })
    }
  })

  
