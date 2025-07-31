import axios from 'axios'

export default async function handler(req, res) {
  try {
    console.log('Fetching all Pokémon! 🥒✨')
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
    const pokemonList = response.data.results
    console.log('Here’s the list, snuggle bug ➡️', pokemonList)
    res.status(200).json(pokemonList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching Pokémon data' })
  }
}
