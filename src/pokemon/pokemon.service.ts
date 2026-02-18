import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

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
      pokemonFound = await this.pokemonModel.findOne({
        no: Number(searchTerm),
      });
    } else if (isValidObjectId(searchTerm)) {
      pokemonFound = await this.pokemonModel.findById(searchTerm);
    } else {
      pokemonFound = await this.pokemonModel.findOne({
        name: searchTerm.toLowerCase().trim(),
      });
    }

    if (!pokemonFound) {
      throw new BadRequestException('That Pokemon was not found');
    }

    return pokemonFound;
  }

  async update(
    searchTerm: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const pokemonFound: Pokemon = await this.findOne(searchTerm);
    try {
      await pokemonFound.updateOne(updatePokemonDto);
      return { ...pokemonFound.toJSON(), ...updatePokemonDto } as Pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 11000) {
      console.error('Error Updating the Pokemon:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException(
      'An error occurred while creating the Pokemon',
    );
  }

  async remove(searchTerm: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: searchTerm,
    });
    if (deletedCount === 0) {
      throw new BadRequestException('That Pokemon was not found');
    }
    return;
  }

  async truncate(): Promise<void> {
    await this.pokemonModel.deleteMany({});
  }

  async batchInsert(pokemons: CreatePokemonDto[]): Promise<Pokemon[]> {
    try {
      return await this.pokemonModel.insertMany(pokemons);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
