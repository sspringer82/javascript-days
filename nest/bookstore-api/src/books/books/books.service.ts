import { Injectable } from '@nestjs/common';
import { setTimeout } from 'node:timers/promises';

@Injectable()
export class BooksService {
    private books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
            { id: 3, title: '1984', author: 'George Orwell' },
        ]
;
    async getAllBooks() {
        await setTimeout(1_000);

        return  this.books;
    }
}
