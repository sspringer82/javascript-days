import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BooksService } from './books.service';

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
}
