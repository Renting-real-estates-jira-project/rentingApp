import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housinglocation";
import dbContent from "../../../db.json";

interface FileWithPreview {
  blob: Blob;
  preview: string;
  name: string;
}

@Component({
  selector: "app-property-listing-form",
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="listing-form-container">
      <header class="form-header">
        <h1>List Your Property</h1>
        <p class="subtitle">
          Fill in the details below to create your property listing
        </p>
      </header>

      <form
        [formGroup]="listingForm"
        (submit)="submitApplication($event)"
        class="listing-form"
      >
        <div class="form-section">
          <h2>Basic Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="propertyName">Property Name</label>
              <input
                id="propertyName"
                type="text"
                formControlName="name"
                placeholder="Enter property name"
                required
              />
            </div>

            <div class="form-group">
              <label for="propertyCity">City</label>
              <input
                id="propertyCity"
                type="text"
                formControlName="city"
                placeholder="Enter city"
                required
              />
            </div>

            <div class="form-group">
              <label for="propertyState">State</label>
              <input
                id="propertyState"
                type="text"
                formControlName="state"
                placeholder="Enter state"
                required
              />
            </div>

            <div class="form-group">
              <label for="propertyPrice">Price</label>
              <div class="price-input-wrapper">
                <span class="currency-symbol">$</span>
                <input
                  id="propertyPrice"
                  type="number"
                  formControlName="price"
                  placeholder="Enter price"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Property Details</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="propertyArea">Area (m²)</label>
              <input
                id="propertyArea"
                type="number"
                formControlName="area"
                placeholder="Enter area"
                required
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="numberOfBedrooms">Bedrooms</label>
              <input
                id="numberOfBedrooms"
                type="number"
                formControlName="number_of_bedrooms"
                placeholder="Number of bedrooms"
                required
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="numberOfBathrooms">Bathrooms</label>
              <input
                id="numberOfBathrooms"
                type="number"
                formControlName="number_of_bathrooms"
                placeholder="Number of bathrooms"
                required
                min="0"
              />
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="wifi" />
              <span class="checkbox-text">WiFi Available</span>
            </label>
          </div>
        </div>

        <div class="form-section">
          <h2>Property Photos</h2>
          <div class="form-group file-upload">
            <label for="photos" class="file-upload-label">
              <span class="upload-icon">📸</span>
              <span class="upload-text">Click to upload photos</span>
              <span class="upload-hint"
                >Supported formats: JPG, PNG (max 5MB)</span
              >
            </label>
            <input
              id="photos"
              type="file"
              (change)="handleFileInput($event)"
              accept="image/*"
              multiple
              class="file-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">List Property</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ["./property-listing-form.component.css"],
})
export class PropertyListingFormComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  // File input element reference
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  maxFiles = 10;

  // Initialize the form
  listingForm = new FormGroup({
    id: new FormControl(Number(Object.keys(dbContent.locations).length)),
    name: new FormControl("", Validators.required),
    city: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    price: new FormControl(0, Validators.required),
    photos: new FormControl<Blob[]>([], Validators.required),
    area: new FormControl(0, Validators.required),
    number_of_bedrooms: new FormControl(0, Validators.required),
    number_of_bathrooms: new FormControl(0, [
      Validators.required,
      Validators.min(0),
    ]),
    wifi: new FormControl(false),
  });

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params["id"], 10);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((housingLocation) => {
        this.housingLocation = housingLocation;
      });
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const errors: string[] = [];

    // console.log(Object.keys(dbContent.locations).length);

    // Get current photos from form
    const currentPhotos = this.listingForm.get("photos")?.value || [];

    // Validate total number of files
    if (currentPhotos.length + files.length > this.maxFiles) {
      errors.push(`Maximum ${this.maxFiles} files allowed`);
      return this.showError(errors.join("\n"));
    }

    // Process each file
    files.forEach((file) => {
      // Check file size
      if (file.size > this.maxFileSize) {
        errors.push(`${file.name} exceeds 5MB size limit`);
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image file`);
        return;
      }

      // Create preview and add to form
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Create a blob from the file
        const blob = new Blob([file], { type: file.type });

        // Add the blob to the form
        this.addPhotoToForm(blob);

        // Create preview object if you need to display previews
        const fileWithPreview: FileWithPreview = {
          blob: blob,
          preview: e.target?.result as string,
          name: file.name,
        };

        // You can store the preview separately if needed for display
        // this.previewImages = [...this.previewImages, fileWithPreview];

        // Trigger change detection if needed
        // this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    });

    // Show any errors
    if (errors.length) {
      this.showError(errors.join("\n"));
    }

    // Reset input value to allow selecting the same file again
    input.value = "";
  }

  private addPhotoToForm(blob: Blob): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    currentPhotos.push(blob); // Push the Blob to the array
    this.listingForm.patchValue({
      photos: currentPhotos,
    });
  }

  private showError(message: string): void {
    // You can implement your preferred error display method here
    console.error(message);
    // Example with a notification service:
    // this.notificationService.error(message);
  }

  // Optional: Method to remove files
  removeFile(index: number): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    currentPhotos.splice(index, 1);
    this.listingForm.patchValue({
      photos: currentPhotos,
    });
  }
  // Submit the property listing
  submitApplication(event: Event) {
    event.preventDefault();
    if (this.listingForm.valid) {
      const formData = this.listingForm.value;
      const photos = formData.photos; // This will contain the Blob objects

      // Send the form data, including the Blob photos, to the service
      this.housingService.submitPropertyListing({
        ...formData,
        photos: photos, // Send the Blob data
      });

      console.log("Property listing submitted:", formData);
      alert("Property listing created successfully!");
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}
