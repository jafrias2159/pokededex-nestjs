import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pokemon-pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonService.create(createPokemonDto);
  }

  @Get(':searchTerm')
  async findOne(@Param('searchTerm') searchTerm: string) {
    return await this.pokemonService.findOne(searchTerm);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.pokemonService.findAll(paginationDto);
  }

  @Patch(':searchTerm')
  update(
    @Param('searchTerm') searchTerm: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(searchTerm, updatePokemonDto);
  }

  @Delete(':searchTerm')
  remove(@Param('searchTerm', ParseMongoIdPipe) searchTerm: string) {
    return this.pokemonService.remove(searchTerm);
  }
}
