import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Character, CharacterDocument} from "./character.schema";
import {CreateCharacterDto} from "./dto/create-character.dto";

@Injectable()
export class CharacterService {
    constructor(
        @InjectModel(Character.name) private readonly characterModel: Model<CharacterDocument>,
    ) {}

    async create(dto: CreateCharacterDto): Promise<CharacterDocument> {
        return this.characterModel.create(dto);
    }

}
