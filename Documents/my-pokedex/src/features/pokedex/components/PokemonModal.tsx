import React from 'react';
import type { Pokemon } from '../types';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, isOpen, onClose }) => {
  if (!isOpen || !pokemon) return null;

  const pokemonId = pokemon.id.toString().padStart(3, '0');
  const imageUrl = 
    pokemon.sprites.other?.['official-artwork']?.front_default || 
    pokemon.sprites.front_default;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-white/20 rounded-3xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-4xl font-bold capitalize">{pokemon.name}</h2>
            <p className="text-gray-400">#{pokemonId}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-4xl text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="flex-shrink-0 flex justify-center">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={pokemon.name}
                className="w-64 h-64 object-contain drop-shadow-2xl"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Types</h3>
              <div className="flex gap-3">
                {pokemon.types.map((t, i) => (
                  <span key={i} className="px-6 py-2 bg-white/10 rounded-full capitalize text-sm">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Height</p>
                <p className="text-2xl font-semibold">{pokemon.height / 10} m</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Weight</p>
                <p className="text-2xl font-semibold">{pokemon.weight / 10} kg</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-3">Base Stats</h3>
              <div className="space-y-3">
                {pokemon.stats.slice(0, 6).map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{stat.stat.name.replace('-', ' ')}</span>
                    <span className="font-mono font-bold">{stat.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;