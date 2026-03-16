import { Injectable } from '@nestjs/common';
import { setTimeout } from 'node:timers/promises';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {

    constructor(private readonly prismaService: PrismaService) { }

    async getAllBooks() {
        return this.prismaService.book.findMany({ include: { comments: true } });
    }

    async getBookById(id: number) {
        return this.prismaService.book.findUnique({ where: { id }, include: { comments: true } });
    }

    async create(createBookDto: any) {
        return this.prismaService.book.create({
            data: createBookDto,
        });
    }
}