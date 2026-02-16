import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {

    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(searchTerm: string): Promise<Pokemon> {
    let pokemonFound: Pokemon | null = null;

    if (!isNaN(Number(searchTerm))) {
      pokemonFound = await this.pokemonModel.findOne({ no: Number(searchTerm) });
    } else if (isValidObjectId(searchTerm)) {
      pokemonFound = await this.pokemonModel.findById(searchTerm);
    } else {
      pokemonFound = await this.pokemonModel.findOne({ name: searchTerm.toLowerCase().trim() });
    }

    if (!pokemonFound) {
      throw new BadRequestException('That Pokemon was not found');
    }

    return pokemonFound;
  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    let pokemonFound: Pokemon = await this.findOne(searchTerm);
    try {
      await pokemonFound.updateOne(updatePokemonDto);
      return { ...pokemonFound.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this.handleExceptions(error);
    }

  }

  handleExceptions(error: any): never {
    if (error.code === 11000) {
      console.error('Error Updating the Pokemon:', error);
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException('An error occurred while creating the Pokemon');
  }

  async remove(searchTerm: string) {
    let pokemonFound: Pokemon = await this.findOne(searchTerm);
    await pokemonFound.deleteOne();
  }
}
