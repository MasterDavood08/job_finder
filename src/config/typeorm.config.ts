import { TypeOrmModuleOptions } from '@nestjs/typeorm'
export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'root',
    database: 'job_finder',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    // logging: "all"
    // dropSchema: true
    // migrations:

}
