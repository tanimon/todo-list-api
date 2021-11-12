import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Todo アイテムの ID。' })
  id: number;

  @Column()
  @ApiProperty({
    example: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    description: 'この Todo アイテムを所有するユーザのユーザ ID。',
  })
  userId: string;

  @Column()
  @ApiProperty({
    example: '牛乳を買う',
    description: 'Todo アイテムのタイトル。',
  })
  title: string;

  @Column()
  @ApiProperty({
    example: 'スーパー A で特売日に牛乳を買う。',
    description: 'Todo アイテムの内容。',
  })
  description: string;

  @Column({ default: false })
  @ApiProperty({
    example: false,
    description: 'Todo アイテムが完了したかどうか。',
  })
  completed: boolean;
}
