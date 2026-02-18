import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokemonResult } from './interfaces/pokemon.interface';

@Injectable()
export class SeedService {
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=2';
  private readonly axiosInstance = axios.create();

  async executeSeed() {
    const allPokemons = await this.axiosInstance.get<PokemonResult>(
      this.pokemonApiUrl,
    );

    const formatPokemons = allPokemons.data.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
      no: pokemon.url.split('/').slice(-2, -1)[0],
    }));

    return formatPokemons;
  }
}
