import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class RolesAccessGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass()
            ]);
    
            const requiredFlags = this.reflector.getAllAndOverride('roleFlags', [
                context.getHandler(),
                context.getClass()
            ]);

            const notRequiredFlags = this.reflector.getAllAndOverride('roleFalseFlags', [
                context.getHandler(),
                context.getClass()
            ]);
    
            if (!requiredRoles && !requiredFlags && !notRequiredFlags) return true;
            
            const req = context.switchToHttp().getRequest();
            const user = req.user;
    
            if (requiredRoles && !user.roles.some(role => requiredRoles.includes(role.value))) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            }
    
            if (requiredFlags && !requiredFlags.some(flag => user.roles.some(role => role[flag]))) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            }

            if (notRequiredFlags && notRequiredFlags.some(flag => user.roles.some(role => role[flag]))) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            }
    
            return true;
        } catch (e) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }
        
    }
    
}