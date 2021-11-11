import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    this.logger.debug(
      `Creating a todo from the DTO: ${JSON.stringify(createTodoDto)}`,
    );
    const todo = this.todosRepository.create(createTodoDto);
    this.logger.debug(`Created a todo: ${JSON.stringify(todo)}`);

    await this.todosRepository.save(todo);
    this.logger.debug(`Saving succeeded: ${this.todosRepository.hasId(todo)}`);

    return todo;
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    this.logger.debug(`Finding todos by userId: ${userId}`);
    const todos = await this.todosRepository.find({ userId });
    this.logger.debug(
      `Found all todos of the user(userId: ${userId}): ${JSON.stringify(
        todos,
      )}`,
    );
    return todos;
  }

  async findOne(id: number): Promise<Todo | undefined> {
    this.logger.debug(`Finding a todo by id: ${id}`);
    const todo = await this.todosRepository.findOne(id);
    this.logger.debug(`Found a todo: ${JSON.stringify(todo)}`);
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    this.logger.debug(
      `Updating a todo(id: ${id}) from the DTO: ${JSON.stringify(
        updateTodoDto,
      )}`,
    );
    const result = await this.todosRepository.update(id, updateTodoDto);
    this.logger.debug(`Update result: ${JSON.stringify(result)}`);
    const updatedTodo = await this.todosRepository.findOne(id);
    this.logger.debug(`Updated a todo: ${JSON.stringify(updatedTodo)}`);

    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing a todo(id: ${id})`);
    await this.todosRepository.delete(id);
    this.logger.debug(`Removed a todo(id: ${id})`);
  }
}
