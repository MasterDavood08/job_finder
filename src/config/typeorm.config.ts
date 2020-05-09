import { TypeOrmModuleOptions } from '@nestjs/typeorm'
export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    // logging: "all"
    // dropSchema: true
    // migrations:

}
