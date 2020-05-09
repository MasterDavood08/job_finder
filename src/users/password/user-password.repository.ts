import { EntityRepository, Repository } from 'typeorm';
import { UserPassword } from './user-password.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(UserPassword)
export class UserpasswordRepository extends Repository<UserPassword>  {
    async checkPassword(userPassword: string, password: string): Promise<boolean> {

        const isValidPass = await bcrypt.compare(password, userPassword);
        return isValidPass

    }


    async createPassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.create({ isActive: true, hashedPassword, user: { id: userId } }).save()
    }
}
