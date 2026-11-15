import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { CharacterDto } from '@bookhelper/shared';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(
    @Body() dto: CreateCharacterDto,
    @CurrentUser() userId: string,
  ): Promise<CharacterDto> {
    return this.characterService.create(dto, userId);
  }

  @Get(':id')
  async find(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() userId: string,
  ): Promise<CharacterDto> {
    return this.characterService.findById(id, userId);
  }

  @Get()
  async findByBookId(
    @Query('bookId', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() userId: string,
  ): Promise<CharacterDto[]> {
    return this.characterService.findByBookId(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateCharacterDto,
    @CurrentUser() userId: string,
  ): Promise<CharacterDto> {
    return this.characterService.update(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.characterService.delete(id, userId);
  }
}
