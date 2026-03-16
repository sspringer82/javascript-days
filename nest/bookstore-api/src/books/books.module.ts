import { Module } from '@nestjs/common';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController, CommentsController],
  providers: [BooksService, CommentsService],
})
export class BooksModule {}
