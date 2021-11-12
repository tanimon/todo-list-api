import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';

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

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            create: jest.fn().mockReturnValue(todo1_1),
            save: jest.fn().mockImplementation((todo) => {
              return Promise.resolve(todo);
            }),
            find: jest.fn().mockImplementation(({ userId }) => {
              const filteredTodos = todos.filter(
                (todo) => todo.userId === userId,
              );
              return Promise.resolve(filteredTodos);
            }),
            findOne: jest.fn().mockResolvedValue(todo1_1),
            hasId: jest.fn().mockReturnValue(true),
            remove: jest.fn().mockResolvedValue(todo1_1),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a todo', () => {
      const createSpy = jest.spyOn(repository, 'create');
      const saveSpy = jest.spyOn(repository, 'save');

      const createTodoDto: CreateTodoDto = {
        userId: todo1_1.userId,
        title: todo1_1.title,
        description: todo1_1.description,
      };

      expect(service.create(createTodoDto)).resolves.toEqual(todo1_1);
      expect(createSpy).toHaveBeenCalledWith(createTodoDto);
      expect(saveSpy).toHaveBeenCalledWith(todo1_1);

      createSpy.mockRestore();
      saveSpy.mockRestore();
    });
  });

  describe('findByUserId()', () => {
    it('should find all todos by userId', () => {
      const findSpy = jest.spyOn(repository, 'find');

      expect(service.findByUserId(todo1_1.userId)).resolves.toEqual([
        todo1_1,
        todo1_2,
      ]);
      expect(findSpy).toHaveBeenCalledWith({ userId: todo1_1.userId });

      findSpy.mockRestore();
    });
  });

  describe('findOne()', () => {
    it('should find a todo by id', () => {
      const findOneSpy = jest.spyOn(repository, 'findOne');

      expect(service.findOne(todo1_1.id)).resolves.toEqual(todo1_1);
      expect(findOneSpy).toHaveBeenCalledWith(todo1_1.id);

      findOneSpy.mockRestore();
    });
  });

  describe('update()', () => {
    it('should update a todo', () => {
      const dto: UpdateTodoDto = {
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
      };

      expect(service.update(todo1_1.id, dto)).resolves.toEqual(updatedTodo);
    });

    it('should return `undefined` for a non-existing id.', () => {
      const spy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(undefined);

      const dto: UpdateTodoDto = {
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
      };

      expect(service.update(9999, dto)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalledWith(9999);

      spy.mockRestore();
    });
  });

  describe('remove()', () => {
    it('should remove a todo', () => {
      expect(service.remove(todo1_1.id)).resolves.toEqual(todo1_1);
    });

    it('should return `undefined` for a non-existing id.', () => {
      const spy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(undefined);

      expect(service.remove(9999)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalledWith(9999);

      spy.mockRestore();
    });
  });
});
