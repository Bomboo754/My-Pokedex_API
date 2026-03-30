import React from 'react';
import type { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: Pokemon) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onClick,
  isFavorite,
  onToggleFavorite,
}) => {
  const pokemonId = pokemon.id.toString().padStart(3, '0');
  const imageUrl = 
    pokemon.sprites.other?.['official-artwork']?.front_default || 
    pokemon.sprites.front_default;

  const typeColors: Record<string, string> = {
    fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-500',
    electric: 'bg-yellow-500', psychic: 'bg-purple-500', dragon: 'bg-indigo-500',
    dark: 'bg-gray-700', fairy: 'bg-pink-500', normal: 'bg-gray-400',
    fighting: 'bg-red-600', flying: 'bg-sky-400', poison: 'bg-purple-600',
    ground: 'bg-amber-600', rock: 'bg-yellow-700', bug: 'bg-lime-500',
    ghost: 'bg-violet-700', steel: 'bg-slate-500', ice: 'bg-cyan-400',
  };

  return (
    <div 
      onClick={() => onClick(pokemon)}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group relative"
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(pokemon);
        }}
        className="absolute top-4 right-4 z-10 text-2xl transition-colors"
      >
        {isFavorite ? '❤️' : '♡'}
      </button>

      <div className="h-48 bg-black/40 flex items-center justify-center p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={pokemon.name}
            className="h-40 w-40 object-contain drop-shadow-xl group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="text-6xl">❓</div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold capitalize">{pokemon.name}</h3>
          <span className="text-gray-400 font-mono">#{pokemonId}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((typeInfo, index) => {
            const typeName = typeInfo.type.name;
            return (
              <span 
                key={index}
                className={`px-4 py-1 text-xs font-semibold rounded-full text-white capitalize ${typeColors[typeName] || 'bg-gray-500'}`}
              >
                {typeName}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;