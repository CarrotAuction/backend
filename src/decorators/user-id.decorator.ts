import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.user.id);
});