import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as moment from 'moment'
import { generateActivationCode } from 'src/auth/genarators';
import { Role } from 'src/core/enums/role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async findOrCreteUser(email: string, isSeeker: boolean): Promise<any> {
        let created = false;
        let user = await this.findOne({ where: { email } });
        if (!user) {
            created = true;
            user = await this.save({
                username: email,
                email,
                role: isSeeker ? Role.SEEKER : Role.EMPLOYER
            })
        }
        return [user, created]
    }

    async isValidatedEmail(email: string) {
        const user = await this.findOne({ where: { email } })
        if (!user) return false

        return user.emailValidated
    }

    async createActivationCode(email: string): Promise<string> {
        const code = generateActivationCode();
        await this.update({ email }, {
            // activationCode: `${Math.floor(Math.random() * (90000)) + 10000}`,
            activationCode: code,
            activationCodeExpiresAt: moment().add(10, 'minutes'),
        })

        return code
    }
}
