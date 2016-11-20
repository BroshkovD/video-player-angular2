import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { HttpModule } from '@angular/http';

import { ToolbarComponent } from './toolbar.component';
import { ProgressComponent } from './progress.component';
import { OptionsComponent } from './options.component';
import { TimeDisplayPipe } from './timedisplay.pipe';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [ AppComponent, ToolbarComponent, ProgressComponent, OptionsComponent, TimeDisplayPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
