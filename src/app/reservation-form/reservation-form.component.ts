import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouteConfigLoadEnd, RouterModule} from '@angular/router';
import {HousingService} from '../housing.service';
import {HousingLocation} from '../housinglocation';


@Component({
  selector: 'app-property-listing-form',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './property-listing-form.component.html',
  styleUrl: './property-listing-form.component.css'
})

export class ReservationFormComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  listingForm = new FormGroup({
    propertyName: new FormControl(''),
    propertyCity: new FormControl(''),
    propertyState: new FormControl(''),
    propertyPrice: new FormControl(0),
    propertyPhotos: new FormControl<FileList | null>(null),
    propertyArea: new FormControl(0),
    numberOfBedrooms: new FormControl(0),
    numberOfBathrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
    wifi: new FormControl(false)
  });
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.listingForm.patchValue({ propertyPhotos: input.files });
      this.listingForm.get('propertyPhotos')?.updateValueAndValidity();
    }
  }

  submitApplication(event: Event) {
    event.preventDefault();
    if (this.listingForm.valid) {
      const formData = this.listingForm.value;
      
      this.housingService.submitPropertyListing({
        ...formData,
        propertyPhotos: formData.propertyPhotos ? Array.from(formData.propertyPhotos) : []
      });

      console.log('Property listing submitted:', formData);
      alert('Property listing created successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}