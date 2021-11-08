import { InterceptorService } from './services/interceptor.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { NgxsModule, NGXS_PLUGINS } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { environment } from 'src/environments/environment';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ChartState } from './states/chart.state';
import { logoutPlugin } from './states/helper.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([AuthState], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot({ key: [AuthState, ChartState] }),
    NgxsEmitPluginModule.forRoot()
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: NGXS_PLUGINS, useValue: logoutPlugin, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
