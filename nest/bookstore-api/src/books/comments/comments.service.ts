import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private readonly prismaService: PrismaService) { }
    async createComment(createCommentDto: {comment: string, bookId: number}) {
        return this.prismaService.comment.create({
            data: createCommentDto,
        });
    }
}
