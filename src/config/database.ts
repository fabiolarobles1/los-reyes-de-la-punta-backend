import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { getConnectionManager } from "typeorm";
import { ConnectionManager } from "typeorm/connection/ConnectionManager";
import { DegreesEntity } from "../entities/degrees.entity";
import { DepartmentsEntity } from "../entities/departments.entity";
import { StudentsEntity } from "../entities/students.entity";

@Injectable()
export class Database implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const connectionManager: ConnectionManager = getConnectionManager();
    let options: any;

    if (connectionManager.has('default')) {
      options = connectionManager.get('default').options;
      await connectionManager.get('default').close();
    } else {
      options = {
        type: 'mysql',
        host: 'upr-enrollment.crbx29ji5uzp.us-east-1.rds.amazonaws.com',
        port: 3306,
        username: 'root',
        password: 'EnrollmentSystem123.',
        database: 'UPR_EnrollmentDB',
        keepConnectionAlive: false,
        extra: {
           charset: "utf8mb4_unicode_ci" 
        },
        // entities: [__dirname + './../**/*.entity!(*.d).{ts,js}'],
        entities: [
          DegreesEntity,
          StudentsEntity,
          DepartmentsEntity
        ],
        synchronize: false
      } as unknown as TypeOrmModuleOptions;

      console.log(options);
    }

    //For dev enviorment  
    // entities: [__dirname + './../**/*.entity!(*.d).{ts,js}'],
    //For prod enviorment
    // entities: [],
    return options;
  }
}
