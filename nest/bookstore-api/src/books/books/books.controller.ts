import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, CreateBookDto } from 'src/book/book/book';
import { ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    @ApiOkResponse({ type: [Book] })
    getAllBooks() {
        return this.booksService.getAllBooks();
    }

    @Get(':id')
    @ApiOkResponse({ type: Book })
    @ApiNotFoundResponse({ description: 'Book not found' })
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

    @ApiResponse({ status: 204, description: 'Book deleted successfully' })
    @Delete(':id')
    async delete(@Param('id') id: string) {
    }
}
