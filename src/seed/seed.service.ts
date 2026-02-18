import { Injectable } from '@nestjs/common';
import { PokemonResult } from './interfaces/pokemon.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';

@Injectable()
export class SeedService {
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly axiosAdapter: AxiosAdapter,
  ) {}

  async executeSeed() {
    const allPokemons = await this.axiosAdapter.get<PokemonResult>(
      this.pokemonApiUrl,
    );

    const formatPokemons = allPokemons.results.map<CreatePokemonDto>(
      (pokemon) => ({
        name: pokemon.name,
        no: Number(pokemon.url.split('/').slice(-2, -1)[0]),
      }),
    );
    await this.pokemonService.truncate();

    await this.pokemonService.batchInsert(formatPokemons);

    return 'Pokemon Seed Executed successfully';
  }
}
