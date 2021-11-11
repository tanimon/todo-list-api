import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiProperty({
    example: '牛乳を買う',
    description: 'Todo アイテムのタイトル。',
    required: false,
  })
  readonly title?: string;

  @ApiProperty({
    example: 'スーパー A で特売日に牛乳を買う。',
    description: 'Todo アイテムの内容。',
    required: false,
  })
  readonly description?: string;

  @ApiProperty({
    example: false,
    description: 'Todo アイテムが完了したかどうか。',
    required: false,
  })
  readonly completed?: boolean;
}
