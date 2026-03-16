import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from 'src/book/book/book';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    getAllBooks() {
        return this.booksService.getAllBooks();
    }

    @Get(':id')
    async getBookById(@Param('id') id: string) {
        const parsedId = parseInt(id, 10);
        const book =  await this.booksService.getBookById(parsedId);

        if (book === undefined) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return book;
    }

    @Post()
    async create(@Body() createBookDto: CreateBookDto) {
        console.log(createBookDto);
        return this.booksService.create(createBookDto);
    }
}
