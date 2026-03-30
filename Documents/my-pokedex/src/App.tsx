import { useState, useEffect } from 'react';
import PokemonList from './features/pokedex/components/PokemonList';
import PokemonModal from './features/pokedex/components/PokemonModal';
import { getPokemonList, getPokemonById } from './features/pokedex/api';
import type { Pokemon } from './features/pokedex/types';

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const LIMIT = 40;

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Initial load
  useEffect(() => {
    const loadInitialPokemons = async () => {
      try {
        setIsLoading(true);
        const data = await getPokemonList(LIMIT, 0);
        const detailedPokemons = await Promise.all(
          data.results.map(async (item) => {
            const id = parseInt(item.url.split('/').filter(Boolean).pop() || '1');
            return await getPokemonById(id);
          })
        );
        setPokemons(detailedPokemons);
        setOffset(LIMIT);
        setHasMore(!!data.next);
      } catch (err) {
        setError('Failed to load Pokémon.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPokemons();
  }, []);

  const loadMorePokemons = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const data = await getPokemonList(LIMIT, offset);
      const detailedPokemons = await Promise.all(
        data.results.map(async (item) => {
          const id = parseInt(item.url.split('/').filter(Boolean).pop() || '1');
          return await getPokemonById(id);
        })
      );
      setPokemons((prev) => [...prev, ...detailedPokemons]);
      setOffset((prev) => prev + LIMIT);
      setHasMore(!!data.next);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const toggleFavorite = (pokemon: Pokemon) => {
    setFavorites((prev) =>
      prev.includes(pokemon.id)
        ? prev.filter((id) => id !== pokemon.id)
        : [...prev, pokemon.id]
    );
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPokemons = activeTab === 'favorites'
    ? filteredPokemons.filter((p) => favorites.includes(p.id))
    : filteredPokemons;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/80 py-6 border-b border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚡</span>
            <h1 className="text-5xl font-bold">Pokédex</h1>
          </div>
          <p className="text-gray-400 hidden md:block">React + TypeScript + Tailwind</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-6xl font-bold mb-4">Gotta Catch 'Em All!</h2>
          <p className="text-xl text-gray-300">Explore the world of Pokémon</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-3 rounded-2xl font-semibold transition ${activeTab === 'all' ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            All Pokémon
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-8 py-3 rounded-2xl font-semibold transition ${activeTab === 'favorites' ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            ❤️ Favorites ({favorites.length})
          </button>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <PokemonList 
          pokemons={displayedPokemons}
          isLoading={isLoading}
          error={error}
          onPokemonClick={handlePokemonClick}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
          onLoadMore={loadMorePokemons}
          hasMore={activeTab === 'all' && hasMore}
          isLoadingMore={isLoadingMore}
        />
      </main>

      <PokemonModal 
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <footer className="py-10 text-center text-gray-500 text-sm">
        Programming II Project • 2026
      </footer>
    </div>
  );
}

export default App;