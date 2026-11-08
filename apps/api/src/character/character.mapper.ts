import { CharacterDto } from '@bookhelper/shared';
import { CharacterDocument } from './character.schema';

export function toCharacterDto(character: CharacterDocument): CharacterDto {
  return {
    _id: character._id.toString(),
    bookId: character.bookId.toString(),
    name: character.name,
    role: character.role,
    description: character.description,
    createdAt: character.createdAt.toISOString(),
    updatedAt: character.updatedAt.toISOString(),
  };
}
