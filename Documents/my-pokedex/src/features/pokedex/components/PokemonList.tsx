import React from 'react';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../types';

interface PokemonListProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: string | null;
  onPokemonClick: (pokemon: Pokemon) => void;
  onToggleFavorite: (pokemon: Pokemon) => void;
  favorites: number[];           // массив id избранных
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  isLoading,
  error,
  onPokemonClick,
  onToggleFavorite,
  favorites,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) => {
  if (isLoading && pokemons.length === 0) {
    return <div className="flex justify-center items-center py-20"><div className="text-2xl text-gray-400 animate-pulse">Loading Pokémon...</div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-200 p-8 rounded-2xl text-center">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {pokemons.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            onClick={onPokemonClick}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-10 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-2xl text-xl font-semibold transition-all active:scale-95 flex items-center gap-3"
          >
            {isLoadingMore ? (
              <>⟳ Loading more...</>
            ) : (
              'Load More Pokémon →'
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default PokemonList;