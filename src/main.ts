import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  defineElement(lottie.loadAnimation);