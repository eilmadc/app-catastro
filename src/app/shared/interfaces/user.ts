export interface Roles{
    admin?: boolean;
    viewer?:boolean;
}

export interface User{
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
}

export interface UserExtended{
    userId: string;
    userName?: string;
    userEmail: string;
    userPhone?: string;
    userPhoto?: string;
    createdAt: Date;
    userol?: Roles;
}