import { UserState } from '@/types/user';

export function calculateAge(user: UserState): number {
    if (!user.profile.dateOfBirth) {
        throw new Error ("Date of birth is not provided");
    }
    const dob = new Date(user.profile.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}