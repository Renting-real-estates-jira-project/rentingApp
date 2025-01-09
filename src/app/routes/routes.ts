import { Routes } from "@angular/router";
import { HomeComponent } from "../components/home/home.component";
import { DetailsComponent } from "../components/details/details.component";
import { PropertyListingFormComponent } from "../components/property-listing-form/property-listing-form.component";

const routeConfig: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "Home page",
  },
  {
    path: "details/:id",
    component: DetailsComponent,
    title: "Home details",
  },
  {
    path: "propertylisting",
    component: PropertyListingFormComponent,
    title: "Property listing form",
  },
];
export default routeConfig;
