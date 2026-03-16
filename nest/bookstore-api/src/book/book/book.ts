
import { IsString, IsNotEmpty, IsISBN, IsInt, Min, Max } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsISBN()
    isbn: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    publishedYear: number;
}
