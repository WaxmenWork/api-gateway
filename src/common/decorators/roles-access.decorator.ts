import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const RoleFlags = (...flags: string[]) => SetMetadata('roleFlags', flags);
export const RoleFalseFlags = (...flags: string[]) => SetMetadata('roleFalseFlags', flags);