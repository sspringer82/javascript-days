import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }


    @Post('books/:bookId/comments')
    async createComment(@Param('bookId') bookId: string, @Body() createCommentDto: {comment: string, bookId: number}) {
        createCommentDto.bookId = Number(bookId);

        console.log(createCommentDto);
        return this.commentsService.createComment(createCommentDto);
    } 

}
