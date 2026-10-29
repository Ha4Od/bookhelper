import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chapter, ChapterDocument} from "./chapter.schema";
import {CreateChapterDto} from "./dto/create-chapter.dto";

@Injectable()
export class ChapterService {

    constructor(
        @InjectModel(Chapter.name) private readonly chapterModel: Model<ChapterDocument>,
    ) {}

    async create(dto: CreateChapterDto): Promise<ChapterDocument> {
        return this.chapterModel.create(dto);
    }


}
