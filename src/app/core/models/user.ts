export interface Roles { 
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
  
export class User {
    uid: string;
    email: string;
    //roles: Roles;
    role: string;
    roleRUS: string;
    userName: string;
}

export class Role { 
    id?: string;
    place?: string;
    type?: string;
 }