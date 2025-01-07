import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-property-listing-form',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './property-listing-form.component.html',
  styleUrls: ['./property-listing-form.component.css']
})
export class PropertyListingFormComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  // Initialize the form
  listingForm = new FormGroup({
    propertyName: new FormControl('', Validators.required),
    propertyCity: new FormControl('', Validators.required),
    propertyState: new FormControl('', Validators.required),
    propertyPrice: new FormControl(0, Validators.required),
    propertyPhotos: new FormControl<Blob[]>([], Validators.required),
    propertyArea: new FormControl(0, Validators.required),
    numberOfBedrooms: new FormControl(0, Validators.required),
    numberOfBathrooms: new FormControl(0, [Validators.required, Validators.min(0)]),
    wifi: new FormControl(false)
  });

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }

  // Handle file selection and store Blob in the form
  handleFileSelect(evt: any) {
    const files = evt.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Store the file as a Blob (no need for Base64 conversion)
      const blob = file.slice(0, file.size, file.type); // Ensure the correct Blob type

      console.log('File Blob:', blob); // For debugging (show the Blob object)

      this.addPhotoToForm(blob);
    }
  }

  // Add the Blob to the form field
  private addPhotoToForm(blob: Blob): void {
    const currentPhotos = this.listingForm.get('propertyPhotos')?.value || [];
    currentPhotos.push(blob);  // Push the Blob to the array
    this.listingForm.patchValue({
      propertyPhotos: currentPhotos
    });
  }

  // Submit the property listing
  submitApplication(event: Event) {
    event.preventDefault();
    if (this.listingForm.valid) {
      const formData = this.listingForm.value;
      const propertyPhotos = formData.propertyPhotos;  // This will contain the Blob objects

      // Send the form data, including the Blob photos, to the service
      this.housingService.submitPropertyListing({
        ...formData,
        propertyPhotos: propertyPhotos  // Send the Blob data
      });

      console.log('Property listing submitted:', formData);
      alert('Property listing created successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
