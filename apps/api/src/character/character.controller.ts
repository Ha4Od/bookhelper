import { Body, Controller, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { CharacterDocument } from './character.schema';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() dto: CreateCharacterDto): Promise<CharacterDocument> {
    return this.characterService.create(dto);
  }
}
