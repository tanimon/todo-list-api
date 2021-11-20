import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './db.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TodosModule, AuthModule],
})
export class AppModule {}
