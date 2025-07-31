// /api/pokemon.js
export default async function handler(req, res) {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
      const data = await response.json()
      res.status(200).json(data.results)
    } catch (error) {
      console.error('❌ Server error:', error)
      res.status(500).json({ message: 'Failed to fetch Pokémon data' })
    }
  }
  