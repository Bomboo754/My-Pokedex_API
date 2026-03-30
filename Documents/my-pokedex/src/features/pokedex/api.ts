import axios from 'axios';
import type { Pokemon, PokemonListResponse } from './types';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

export const getPokemonList = async (
  limit: number = 20, 
  offset: number = 0
): Promise<PokemonListResponse> => {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonById = async (id: number | string): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${id}`);
  return response.data;
};

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${name.toLowerCase()}`);
  return response.data;
};