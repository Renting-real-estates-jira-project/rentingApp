import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DetailsComponent} from './details/details.component';
import { PropertyListingFormComponent } from './property-listing-form/property-listing-form.component';


const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
  },
  {
    path: 'propertylisting',
    component: PropertyListingFormComponent,
    title: 'Property listing form'
  },
];
export default routeConfig;