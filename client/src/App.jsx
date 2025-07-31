// App.jsx
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]) /* set Pokemon list means it stores the pokemonList from wherever you call set */
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const itemsPerPage = 20

  useEffect(() => {
    async function fetchPokemonWithTypes() {
      try {
        const res = await fetch('/api/pokemon')
        const data = await res.json()

        const detailedData = await Promise.all(
          data.map(async (pokemon) => {
            const res = await fetch(pokemon.url)
            const details = await res.json()

            return {
              ...pokemon,
              id: details.id,
              types: details.types.map((t) => t.type.name),
              imageUrl: details.sprites.front_default,
              hp: details.stats[0].base_stat,
              attack: details.stats[1].base_stat,
              defense: details.stats[2].base_stat,
              speed: details.stats[5].base_stat,
              height: details.height,
              weight: details.weight,
              abilities: details.abilities.map((a) => a.ability.name),
            }
          })
        )

        setPokemonList(detailedData) /* the set function is called here after calling the json file from backend */
        setIsLoading(false)
      } catch (err) {
        console.error('💥 Failed to fetch Pokémon:', err)
        setIsLoading(false)
      }
    }

    fetchPokemonWithTypes()
  }, [])
  useEffect(() => {
    setCurrentPage(1) // reset to first page whenever filters change
  }, [searchTerm, selectedRegion, selectedType, sortBy, sortOrder])

  const regionLimits = {
    kanto: [1, 151],
    johto: [152, 251],
    hoenn: [252, 386],
    sinnoh: [387, 493],
    unova: [494, 649],
    kalos: [650, 721],
    alola: [722, 809],
    galar: [810, 898],
    paldea: [899, 1010],
  }

  const filteredPokemon = pokemonList /* we are naming each pokemon as a variable p */
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => {
      if (selectedRegion === 'all') return true
      const [min, max] = regionLimits[selectedRegion]
      return p.id >= min && p.id <= max /* maps regionLimits list to id pulled from pokemon details */
    })
    .filter((p) => {
      if (selectedType === 'all') return true
      return p.types.includes(selectedType)
    })
    .sort((a, b) => {
      const fieldA = sortBy === 'name' ? a.name.toLowerCase() : a.id
      const fieldB = sortBy === 'name' ? b.name.toLowerCase() : b.id
  
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentPokemon = filteredPokemon.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage)

  return (
    <Router>
      <div className="App">
        <h1>PookieDex by Ahantya</h1>
        <Routes>
          <Route
            path="/"
            element={
              isLoading ? (
                <div className="loading-container">
                  <div className="pokeball-spinner">⚪️</div>
                  <p>Loading your Pookiédex...</p>
                </div>
              ) : (
                <>
                  <Filters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                  <div className="pokemon-grid">
                    {currentPokemon.map((pokemon) => (
                      <Link
                        to={`/pokemon/${pokemon.id}`}
                        key={pokemon.id}
                        className="pokemon-card"
                      >
                        <img src={pokemon.imageUrl} alt={pokemon.name} />
                        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <p className="poke-id">#{pokemon.id}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="pagination">
                  <span className="page-info">Page {currentPage} of {totalPages}</span>
                  <div className="pagination-buttons">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                      ◀ Prev
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                      Next ▶
                    </button>
                  </div>
                </div>

                </>
              )
            }
          />

          <Route
            path="/pokemon/:id"
            element={<PokemonDetail pokemonList={pokemonList} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

function Filters({ searchTerm, setSearchTerm, selectedRegion, setSelectedRegion, selectedType, setSelectedType, sortBy, setSortBy,
  sortOrder, setSortOrder }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        <option value="all">🌍 All Regions</option>
        <option value="kanto">Kanto</option>
        <option value="johto">Johto</option>
        <option value="hoenn">Hoenn</option>
        <option value="sinnoh">Sinnoh</option>
        <option value="unova">Unova</option>
        <option value="kalos">Kalos</option>
        <option value="alola">Alola</option>
        <option value="galar">Galar</option>
        <option value="paldea">Paldea</option>
      </select>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="all">🧃 All Types</option>
        <option value="normal">Normal</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="electric">Electric</option>
        <option value="ice">Ice</option>
        <option value="fighting">Fighting</option>
        <option value="poison">Poison</option>
        <option value="ground">Ground</option>
        <option value="flying">Flying</option>
        <option value="psychic">Psychic</option>
        <option value="bug">Bug</option>
        <option value="rock">Rock</option>
        <option value="ghost">Ghost</option>
        <option value="dark">Dark</option>
        <option value="dragon">Dragon</option>
        <option value="steel">Steel</option>
        <option value="fairy">Fairy</option>
      </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="id">Sort by ID</option>
        <option value="name">Sort by Name</option>
      </select>

  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
    <option value="asc">⬆️ Ascending</option>
    <option value="desc">⬇️ Descending</option>
  </select>

    </div>
  )
}

function PokemonDetail({ pokemonList }) {
  const { id } = useParams() /* grabs URL parameter named id so if you’re visiting /pokemon/25, then id will be "25" (a string!) */
  const pokemon = pokemonList.find((p) => p.id === Number(id)) /* you then use it to find the Pokémon with that ID */

  if (!pokemon) {
    return <p color="black">Loading Pokémon data... ⏳</p>
  }

  /* then deisplays the data  using pokemon info */
  return (
    <div className="pokemon-detail"> 
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #{pokemon.id}</h2>
      <img src={pokemon.imageUrl} alt={pokemon.name} />
      <p><strong>Types:</strong> {pokemon.types.join(', ')}</p>
      <p><strong>Abilities:</strong> {pokemon.abilities.join(', ')}</p>
      <p><strong>HP:</strong> {pokemon.hp} | <strong>Attack:</strong> {pokemon.attack} | <strong>Defense:</strong> {pokemon.defense}</p>
      <p><strong>Speed:</strong> {pokemon.speed}</p>
      <p><strong>Height:</strong> {pokemon.height / 10} m | <strong>Weight:</strong> {pokemon.weight / 10} kg</p>
      <button onClick={() => window.history.back()}>← Back to PookieDex</button>
    </div>
  )
}

export default App
