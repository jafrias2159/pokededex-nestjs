import { Transform } from "class-transformer";
import { IsNumber, IsPositive, IsString, Length, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsNumber()
    @IsPositive()
    @Min(1)
    no: number;
    
    @IsString()
    @MinLength(1)
    @Transform(({ value }) => value.toLocaleLowerCase().trim())
    name: string;
}
