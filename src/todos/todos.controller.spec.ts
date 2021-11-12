import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { AuthService } from '../auth/auth.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const todo1_1: Todo = {
  id: 1,
  userId: 'test-user-id-1',
  title: 'test #1_1',
  description: 'test description #1_1',
  completed: false,
};

const todo1_2: Todo = {
  id: 3,
  userId: 'test-user-id-1',
  title: 'test #1_2',
  description: 'test description #1_2',
  completed: false,
};

const todo2_1: Todo = {
  id: 2,
  userId: 'test-user-id-2',
  title: 'test #2_1',
  description: 'test description #2_1',
  completed: false,
};

const todos = [todo1_1, todo2_1, todo1_2];

const updatedTodo: Todo = {
  id: todo1_1.id,
  userId: todo1_1.userId,
  title: 'updated title',
  description: 'updated description',
  completed: true,
};

const token = 'test-token';
const request = {
  headers: { authorization: token } as Request['headers'],
} as Request;

const notFoundExceptionMessage = 'Todo item was not found.';
const forbiddenExceptionMessage =
  'You are not allowed to access this todo item.';

describe('TodosController', () => {
  let controller: TodosController;
  let todosService: TodosService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn().mockResolvedValue(todo1_1),
            findByUserId: jest.fn().mockImplementation((userId) => {
              const filteredTodos = todos.filter(
                (todo) => todo.userId === userId,
              );
              return Promise.resolve(filteredTodos);
            }),
            findOne: jest.fn().mockResolvedValue(todo1_1),
            update: jest.fn().mockResolvedValue(updatedTodo),
            remove: jest.fn().mockResolvedValue(todo1_1),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getCurrentUserId: jest.fn().mockReturnValue(todo1_1.userId),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new todo.', () => {
      const dto: CreateTodoDto = {
        title: todo1_1.title,
        description: todo1_1.description,
        userId: undefined,
      };

      expect(controller.create(request, dto)).resolves.toEqual(todo1_1);
      expect(todosService.create).toHaveBeenCalledWith({
        userId: todo1_1.userId,
        ...dto,
      });
    });
  });

  describe('findAll()', () => {
    it('should return all todos of the current user.', () => {
      expect(controller.findAll(request)).resolves.toEqual([todo1_1, todo1_2]);
      expect(authService.getCurrentUserId).toHaveBeenCalledWith(token);
      expect(todosService.findByUserId).toHaveBeenCalledWith(todo1_1.userId);
    });
  });

  describe('findOne()', () => {
    it('should return a todo.', () => {
      expect(controller.findOne(todo1_1.id, request)).resolves.toEqual(todo1_1);
      expect(todosService.findOne).toHaveBeenCalledWith(todo1_1.id);
    });

    it('should throw an HttpException with status code 404.', () => {
      const spy = jest
        .spyOn(todosService, 'findOne')
        .mockResolvedValue(undefined);
      const todoId = 9999;

      expect(controller.findOne(todoId, request)).rejects.toThrow(
        new HttpException(notFoundExceptionMessage, HttpStatus.NOT_FOUND),
      );
      expect(spy).toHaveBeenCalledWith(todoId);

      spy.mockRestore();
    });

    it('should throw an HttpException with status code 403.', () => {
      const spy = jest
        .spyOn(authService, 'getCurrentUserId')
        .mockReturnValue('another-user-id');

      expect(controller.findOne(todo1_1.id, request)).rejects.toThrow(
        new HttpException(forbiddenExceptionMessage, HttpStatus.FORBIDDEN),
      );
      expect(todosService.findOne).toHaveBeenCalledWith(todo1_1.id);

      spy.mockRestore();
    });
  });

  describe('update()', () => {
    it('should update a todo.', () => {
      const dto = {
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
      };

      expect(controller.update(todo1_1.id, request, dto)).resolves.toEqual(
        updatedTodo,
      );
      expect(todosService.findOne).toHaveBeenCalledWith(todo1_1.id);
    });

    it('should throw an HttpException with status code 404.', () => {
      const spy = jest
        .spyOn(todosService, 'findOne')
        .mockResolvedValue(undefined);
      const todoId = 9999;

      const dto = {
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
      };

      expect(controller.update(todoId, request, dto)).rejects.toThrow(
        new HttpException(notFoundExceptionMessage, HttpStatus.NOT_FOUND),
      );
      expect(spy).toHaveBeenCalledWith(todoId);

      spy.mockRestore();
    });

    it('should throw an HttpException with status code 403.', () => {
      const spy = jest
        .spyOn(authService, 'getCurrentUserId')
        .mockReturnValue('another-user-id');

      const dto = {
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
      };

      expect(controller.update(todo1_1.id, request, dto)).rejects.toThrow(
        new HttpException(forbiddenExceptionMessage, HttpStatus.FORBIDDEN),
      );
      expect(todosService.findOne).toHaveBeenCalledWith(todo1_1.id);

      spy.mockRestore();
    });
  });

  describe('remove()', () => {
    it('should remove a todo.', () => {
      expect(controller.remove(todo1_1.id, request)).resolves.not.toThrow();
      expect(todosService.findOne).toHaveBeenCalledWith(todo1_1.id);
    });

    it('should throw an HttpException with status code 404.', () => {
      const spy = jest
        .spyOn(todosService, 'findOne')
        .mockResolvedValue(undefined);
      const todoId = 9999;

      expect(controller.remove(todoId, request)).rejects.toThrow(
        new HttpException(notFoundExceptionMessage, HttpStatus.NOT_FOUND),
      );
      expect(spy).toHaveBeenCalledWith(todoId);
      expect(todosService.remove).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should throw an HttpException with status code 403.', () => {
      const spy = jest
        .spyOn(authService, 'getCurrentUserId')
        .mockReturnValue('another-user-id');

      expect(controller.remove(todo1_1.id, request)).rejects.toThrow(
        new HttpException(forbiddenExceptionMessage, HttpStatus.FORBIDDEN),
      );
      expect(todosService.remove).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
