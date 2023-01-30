import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DiagramComponent } from './diagram/diagram.component'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormModule } from '@fundamental-ngx/core/form'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    declarations: [AppComponent, DiagramComponent],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class AppModule {}
