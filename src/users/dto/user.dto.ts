export class UserDto {
    readonly username: string;
    readonly email: string;
    readonly phoneNumber: string;
    constructor(object: any) {
        this.username = object.username;
        this.email = object.email;
        this.phoneNumber = object.phoneNumber;

    }
}
