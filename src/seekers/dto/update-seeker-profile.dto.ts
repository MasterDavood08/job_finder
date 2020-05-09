
export class UpdateSeekerProfileDto {
    fullName: string
    general: string
    contacts: string[]
    experience: string[]
    education: string[]
    tags: string[]
    ksao: { name: string, description: string }[]
}
