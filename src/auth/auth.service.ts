import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { SeekerLoginDto } from './dto/seeker-login.dto';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserpasswordRepository } from 'src/users/password/user-password.repository';
import * as moment from 'moment'
import { EmployerLoginDto } from './dto/employer-login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from 'src/core/enums/role.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(UserpasswordRepository)
        private userpassRepository: UserpasswordRepository
    ) { }

    async validateSeekerLoginWithActivationCode(seekerLoginDto: SeekerLoginDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: seekerLoginDto.email,
                activationCode: seekerLoginDto.activationCode,
                role: Role.SEEKER
            }
        });

        if (!user) {
            throw new HttpException('LOGIN.User_not_found', HttpStatus.NOT_FOUND)
        }

        if (moment().isAfter(user.activationCodeExpiresAt)) {
            throw new HttpException('LOGIN.ActivationCode_WRONG', HttpStatus.FORBIDDEN)
        }
        await this.userRepository.update(user.id, {
            activationCode: null,
            activationCodeExpiresAt: null,
            isLoggedIn: true,
            lastLoginDate: moment(),
            emailValidated: true,
            failedLoginAttempts: 0,
            canNotLoginUntil: null
        })

        // create password
        await this.userpassRepository.createPassword(user.id, seekerLoginDto.password)
        const payload: JwtPayload = { email: user.email, sub: user.id }
        return this.jwtService.sign(payload)
    }
    async validateSeekerLoginWithPassword(seekerLoginDto: SeekerLoginDto): Promise<any> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email: seekerLoginDto.email,
                    role: Role.SEEKER
                },
                relations: ['userPasswords']
            });
            if (!user) {
                throw new HttpException('LOGIN.User_not_found', HttpStatus.NOT_FOUND)
            }
            const isValidPass = await this.userpassRepository.checkPassword(user.userPasswords.find(p => p.isActive === true).hashedPassword, seekerLoginDto.password)
            if (!isValidPass) {
                await this.userRepository.increment({ id: user.id }, 'failedLoginAttempts', 1);
                throw new HttpException('LOGIN.PASS_WRONG', HttpStatus.FORBIDDEN)// forbiden or unauthorize
            }
            if (user.canNotLoginUntil && moment().isBefore(user.canNotLoginUntil)) {
                throw new HttpException('LOGIN.Can_not_Login_until_X_time', HttpStatus.FORBIDDEN)
            }
            if (user.failedLoginAttempts === 5) {
                await this.userRepository.update(user.id, {
                    failedLoginAttempts: 0,
                    canNotLoginUntil: moment().add(30, 'minutes')
                })
                throw new HttpException('LOGIN.Can_not_Login_until_X_time', HttpStatus.FORBIDDEN)
            }
            const payload: JwtPayload = { email: user.email, sub: user.id }
            return this.jwtService.sign(payload)
        } catch (e) {
            throw new BadRequestException(e)
        }

    }

    async validateEmployerLoginWithActivationCode(employerLoginDto: EmployerLoginDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: employerLoginDto.email,
                activationCode: employerLoginDto.activationCode,
                role: Role.EMPLOYER
            }
        });

        if (!user) {
            throw new HttpException('LOGIN.User_not_found', HttpStatus.NOT_FOUND)
        }

        if (moment().isAfter(user.activationCodeExpiresAt)) {
            throw new HttpException('LOGIN.ActivationCode_WRONG', HttpStatus.FORBIDDEN)
        }
        await this.userRepository.update(user.id, {
            activationCode: null,
            activationCodeExpiresAt: null,
            isLoggedIn: true,
            lastLoginDate: moment(),
            emailValidated: true,
            failedLoginAttempts: 0,
            canNotLoginUntil: null
        })

        // create password
        await this.userpassRepository.createPassword(user.id, employerLoginDto.password)
        const payload: JwtPayload = { email: user.email, sub: user.id }
        return this.jwtService.sign(payload)
    }
    async validateEmployerLoginWithPassword(employerLoginDto: EmployerLoginDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: employerLoginDto.email,
                role: Role.EMPLOYER
            },
            relations: ['userPasswords']
        });
        if (!user) {
            throw new HttpException('LOGIN.User_not_found', HttpStatus.NOT_FOUND)
        }
        const isValidPass = await this.userpassRepository.checkPassword(user.userPasswords.find(p => p.isActive === true).hashedPassword, employerLoginDto.password)
        if (!isValidPass) {
            await this.userRepository.increment({ id: user.id }, 'failedLoginAttempts', 1);
            throw new HttpException('LOGIN.PASS_WRONG', HttpStatus.FORBIDDEN)// forbiden or unauthorize
        }
        if (user.canNotLoginUntil && moment().isBefore(user.canNotLoginUntil)) {
            throw new HttpException('LOGIN.Can_not_Login_until_X_time', HttpStatus.FORBIDDEN)
        }
        if (user.failedLoginAttempts === 5) {
            await this.userRepository.update(user.id, {
                failedLoginAttempts: 0,
                canNotLoginUntil: moment().add(30, 'minutes')
            })
            throw new HttpException('LOGIN.Can_not_Login_until_X_time', HttpStatus.FORBIDDEN)
        }
        const payload: JwtPayload = { email: user.email, sub: user.id }
        return this.jwtService.sign(payload)

    }

    async sendActivationCode(user: User): Promise<void> {
        if (moment().isAfter(user.activationCodeExpiresAt) || !user.activationCodeExpiresAt) {
            const activationCode = await this.userRepository.createActivationCode(user.email);
            // send code via sms send error if fail
            this.sendEmail(activationCode, user.email)
        }

    }

    public sendEmail(activationCode: string, userEmail: string): void {
        this
            .mailerService
            .sendMail({
                to: userEmail, // List of receivers email address
                from: 'davoodebi789@gmail.com', // Senders email address
                subject: 'کد فعال سازی',
                template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
                context: {  // Data to be sent to template engine.
                    code: activationCode,
                },
            })
            .then((success) => {
                console.log(success)
            })
            .catch((err) => {
                console.log(err)
            });
    }
}
