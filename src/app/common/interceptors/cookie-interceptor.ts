import { HttpInterceptorFn } from "@angular/common/http";

export const cookieCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
    const withCredentials = true;
    return next(req.clone({ withCredentials }));
}