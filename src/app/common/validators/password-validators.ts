import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const PASSWORD_STRENGTH_MESSAGE =
    'Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, and 1 number';
export const PASSWORD_STRENGTH_MESSAGE_LIST =
    ['at least 8 characters', '1 uppercase letter', '1 lowercase letter', '1 number'];

/** Empty is valid; non-empty must match the strength pattern (e.g. optional password on edit). */
export function optionalPasswordStrengthValidator(pattern: RegExp = PASSWORD_STRENGTH_REGEX): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value == null || String(value).length === 0) {
            return null;
        }
        return Validators.pattern(pattern)(control);
    };
}

export function passwordsMatchValidator(
    passwordFieldKey: string = 'password',
    confirmFieldKey: string = 'confirmPassword',
): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const formGroup = group as FormGroup;
        const password = formGroup.get(passwordFieldKey)?.value ?? '';
        const confirmPassword = formGroup.get(confirmFieldKey)?.value ?? '';
        if (!confirmPassword.length) {
            return null;
        }
        return password === confirmPassword ? null : { passwordsMismatch: true };
    };
}
