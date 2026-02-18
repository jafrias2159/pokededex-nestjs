import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokemonResult } from './interfaces/pokemon.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';
  private readonly axiosInstance = axios.create();

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const allPokemons = await this.axiosInstance.get<PokemonResult>(
      this.pokemonApiUrl,
    );

    const formatPokemons = allPokemons.data.results.map<CreatePokemonDto>(
      (pokemon) => ({
        name: pokemon.name,
        no: Number(pokemon.url.split('/').slice(-2, -1)[0]),
      }),
    );

    await this.pokemonService.batchInsert(formatPokemons);

    return 'Pokemon Seed Executed successfully';
  }
}
