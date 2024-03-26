import { AuthGuard } from "@nestjs/passport";

export class UserJwtAuthGuard extends AuthGuard('user-jwt'){}