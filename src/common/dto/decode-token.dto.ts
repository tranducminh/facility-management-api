import { UserRole } from '../enums/user-role.enum';

export class DecodeToken {
  id: string;
  exp: number;
  role: UserRole;
}
