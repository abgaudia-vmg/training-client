import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor() { }

    public generateEmail = ({ firstName, lastName }: { firstName: string, lastName: string }) => {

        const firstNameNormalized = firstName.toLowerCase().replace(/ /g, '');
        const lastNameNormalized = lastName.toLowerCase().replace(/ /g, '');
        const firstNameThreeLetters = firstNameNormalized.slice(0, 3);
        const finalUsername = `${firstNameThreeLetters}${lastNameNormalized}@veteranmedicalgroupinc.com`;

        return finalUsername;
    }
}