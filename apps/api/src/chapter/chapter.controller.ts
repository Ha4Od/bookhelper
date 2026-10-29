import {Body, Controller, Post} from '@nestjs/common';
import {ChapterService} from "./chapter.service";
import {CreateChapterDto} from "./dto/create-chapter.dto";
import {ChapterDocument} from "./chapter.schema";

@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @Post()
    async create(@Body() dto: CreateChapterDto): Promise<ChapterDocument> {
        return this.chapterService.create(dto)
    }
}
