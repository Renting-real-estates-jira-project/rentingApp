import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DetailsComponent} from './details/details.component';
import { PropertyListingFormComponent } from './property-listing-form/property-listing-form.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';


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
  {
    path: 'reservation',
    component:  ReservationFormComponent,
    title: 'Reservation form'
  },
];
export default routeConfig;