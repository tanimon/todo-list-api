import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { AuthService } from '../auth/auth.service';

@ApiBearerAuth()
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Todo アイテムを正常に作成できました。',
    type: Todo,
  })
  async create(@Req() request: Request, @Body() createTodoDto: CreateTodoDto) {
    createTodoDto.userId = this.getUserId(request);
    return await this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Todo アイテムを正常に取得できました。',
    type: [Todo],
  })
  async findAll(@Req() request: Request): Promise<Todo[]> {
    const userId = this.getUserId(request);
    return await this.todosService.findByUserId(userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '取得する Todo アイテムの ID' })
  @ApiOkResponse({
    description: 'Todo アイテムを正常に取得できました。',
    type: Todo,
  })
  @ApiForbiddenResponse({
    description: 'Todo アイテムへのアクセス権限がありません。',
  })
  @ApiNotFoundResponse({ description: 'Todo アイテムが存在しません。' })
  async findOne(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Todo> {
    return await this.findAndAuthenticate(id, request);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: '更新する Todo アイテムの ID' })
  @ApiOkResponse({
    description: 'Todo アイテムを正常に更新できました。',
    type: Todo,
  })
  @ApiForbiddenResponse({
    description: 'Todo アイテムへのアクセス権限がありません。',
  })
  @ApiNotFoundResponse({ description: 'Todo アイテムが存在しません。' })
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    await this.findAndAuthenticate(id, request);
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Todo アイテムを正常に削除できました。',
  })
  @ApiForbiddenResponse({
    description: 'Todo アイテムへのアクセス権限がありません。',
  })
  @ApiNotFoundResponse({ description: 'Todo アイテムが存在しません。' })
  async remove(@Param('id') id: number, @Req() request: Request) {
    await this.findAndAuthenticate(id, request);
    return this.todosService.remove(id);
  }

  private getUserId(request: Request) {
    const token = request.headers.authorization;
    const userId = this.authService.getCurrentUserId(token);
    return userId;
  }

  private async findAndAuthenticate(
    id: number,
    request: Request,
  ): Promise<Todo> {
    const todo = await this.todosService.findOne(id);

    if (!todo) {
      throw new HttpException('Todo item was not found.', HttpStatus.NOT_FOUND);
    }

    const userId = this.getUserId(request);

    if (todo.userId !== userId) {
      throw new HttpException(
        'You are not allowed to access this todo item.',
        HttpStatus.FORBIDDEN,
      );
    }

    return todo;
  }
}
