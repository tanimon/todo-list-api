import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    example: '牛乳を買う',
    description: 'Todo アイテムのタイトル。',
  })
  readonly title: string;

  @ApiProperty({
    example: 'スーパー A で特売日に牛乳を買う。',
    description: 'Todo アイテムの内容。',
  })
  readonly description: string;

  userId: string;
}
