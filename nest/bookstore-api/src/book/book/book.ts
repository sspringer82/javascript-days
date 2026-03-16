
import { ApiProperty } from '@nestjs/swagger';
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

class Comment {
    @ApiProperty()
    comment: string;
}


export class Book {
    @ApiProperty()
    id: number;
    @ApiProperty({example: 'Example Book Title'})
    title: string
    @ApiProperty({example: '978-3-16-148410-0'})
    isbn: string;
    @ApiProperty({example: 'John Doe'})
    author: string;
    @ApiProperty({example: 2020})
    publishedYear: number;
    @ApiProperty({type: [Comment]})
    comments: Comment[];
}