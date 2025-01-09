import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { HousingService } from "../../services/housing.service";
import { HousingLocation } from "../../interfaces/housinglocation";
import { UploadComponent } from "../upload/upload.component";
import dbContent from "../../../../db.json";

@Component({
  selector: "app-property-listing-form",
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, UploadComponent],
  templateUrl: "./property-listing-form.component.html",
  styleUrl: "./property-listing-form.component.css",
})
export class PropertyListingFormComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  maxFiles = 10;

  listingForm = new FormGroup({
    id: new FormControl(String(Object.keys(dbContent.locations).length)),
    name: new FormControl("", Validators.required),
    city: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    photos: new FormControl<string[]>(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
    area: new FormControl(0, [Validators.required, Validators.min(0)]),
    number_of_bedrooms: new FormControl(0, [
      Validators.required,
      Validators.min(0),
    ]),
    number_of_bathrooms: new FormControl(0, [
      Validators.required,
      Validators.min(0),
    ]),
    wifi: new FormControl(false),
  });

  onImageUploaded(imagePath: string): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    if (currentPhotos.length < this.maxFiles) {
      currentPhotos.push(imagePath);
      this.listingForm.patchValue({ photos: currentPhotos });
      this.listingForm.get("photos")?.markAsTouched();
    } else {
      alert(`Maximum of ${this.maxFiles} photos allowed.`);
    }
  }

  removeImage(index: number): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    currentPhotos.splice(index, 1);
    this.listingForm.patchValue({ photos: currentPhotos });
    if (currentPhotos.length === 0) {
      this.listingForm.get("photos")?.markAsTouched();
    }
  }

  async submitApplication(event: Event) {
    event.preventDefault();

    if (this.listingForm.valid) {
      try {
        await this.housingService.submitPropertyListing(this.listingForm.value);
        alert("Property listing created successfully!");
        this.listingForm.reset();
      } catch (error) {
        console.error("Submission failed:", error);
        alert("Failed to create property listing. Please try again.");
      }
    } else {
      Object.keys(this.listingForm.controls).forEach((key) => {
        const control = this.listingForm.get(key);
        control?.markAsTouched();
      });
      alert("Please fill all required fields correctly.");
    }
  }
}
