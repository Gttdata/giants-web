import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ReportsModule } from './reports/reports.module';
import { AllothercomponentsModule } from './allothercomponents/allothercomponents.module';
import { AppComponent } from './app.component';

registerLocaleData(en);

@NgModule({
  declarations: [],

  imports: [
    ReportsModule,
    AllothercomponentsModule,
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
