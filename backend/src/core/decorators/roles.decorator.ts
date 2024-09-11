import { SetMetadata } from '@nestjs/common';
import { Role } from '../EnumRoles/role.enum';

export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata('roles', roles);
