import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { cookieCredentialsInterceptor } from "./app/common/interceptors/cookie-interceptor";
import { reloginInterceptor } from "./app/common/interceptors/relogin.interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([cookieCredentialsInterceptor, reloginInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

