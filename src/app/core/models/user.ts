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
}