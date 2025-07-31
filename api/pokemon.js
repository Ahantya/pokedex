export default async function handler(req, res) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0')
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon data')
    }
    const data = await response.json()
    res.status(200).json(data.results)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Pokémon data' })
  }
}