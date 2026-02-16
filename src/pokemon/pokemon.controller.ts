import { Controller, Post, Body, Get, Param, Patch, Delete} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonService.create(createPokemonDto);
  }

  // @Get()
  // findAll() {
  //   return this.pokemonService.findAll();
  // }

  @Get(':searchTerm')
  async findOne(@Param('searchTerm') searchTerm: string) {
    return await this.pokemonService.findOne(searchTerm);
  }

  @Patch(':searchTerm')
  update(@Param('searchTerm') searchTerm: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(searchTerm, updatePokemonDto);
  }

  @Delete(':searchTerm')
  remove(@Param('searchTerm') searchTerm: string) {
    return this.pokemonService.remove(searchTerm);
  }
}