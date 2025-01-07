import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Exterior photo of {{ housingLocation?.name }}"
        crossorigin
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Price: {{ housingLocation?.price }}</li>
          <li>Area: {{ housingLocation?.area }}</li>
          <li>Number of bedrooms: {{ housingLocation?.number_of_bedrooms }}</li>
          <li>Number of bathrooms: {{ housingLocation?.number_of_bathrooms }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
        </ul>
      </section>


      <section class="reserve-section" style="margin-top: 20px;">
        <button class="reservation_form" [routerLink]="['reservation']">
      reserve this property
    </button>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }

  onReserve(): void {
    if (this.housingLocation) {
      console.log(`Property reserved: ${this.housingLocation.name}`);
    }
  }
}
