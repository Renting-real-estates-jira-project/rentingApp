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
import { ImageStorageService } from "../image-storage.service";
import { forkJoin, Observable } from "rxjs";
import dbContent from "../../../db.json";

interface ImagePreview {
  path: string;
  preview: string;
  name: string;
}

@Component({
  selector: "app-property-listing-form",
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./property-listing-form.component.html",
  styleUrl: "./property-listing-form.component.css",
})
export class PropertyListingFormComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  imageStorage = inject(ImageStorageService);
  housingLocation: HousingLocation | undefined;

  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  maxFiles = 10;

  listingForm = new FormGroup({
    id: new FormControl(String(Object.keys(dbContent.locations).length)),
    name: new FormControl("", Validators.required),
    city: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    price: new FormControl(0, Validators.required),
    photos: new FormControl<ImagePreview[]>([], Validators.required),
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

      // Create preview and upload file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Upload the file and get the path
        this.imageStorage.uploadImage(file).subscribe({
          next: (path) => {
            const imagePreview: ImagePreview = {
              path: path,
              preview: e.target?.result as string,
              name: file.name,
            };
            this.addPhotoToForm(imagePreview);
          },
          error: (error) => {
            this.showError(`Failed to upload ${file.name}: ${error.message}`);
          },
        });
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

  private addPhotoToForm(imagePreview: ImagePreview): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    currentPhotos.push(imagePreview);
    this.listingForm.patchValue({
      photos: currentPhotos,
    });
  }

  private showError(message: string): void {
    console.error(message);
    alert(message);
  }

  removeFile(index: number): void {
    const currentPhotos = this.listingForm.get("photos")?.value || [];
    const photoToRemove = currentPhotos[index];

    // Delete the file from storage
    this.imageStorage.deleteImage(photoToRemove.path).subscribe({
      next: () => {
        currentPhotos.splice(index, 1);
        this.listingForm.patchValue({
          photos: currentPhotos,
        });
      },
      error: (error) => {
        this.showError(`Failed to remove image: ${error.message}`);
      },
    });
  }

  submitApplication(event: Event) {
    event.preventDefault();
    if (this.listingForm.valid) {
      const formData = this.listingForm.value;

      // Extract just the paths for submission
      const photoPaths = formData.photos?.map((photo) => photo.path) || [];

      // Send the form data with photo paths
      this.housingService.submitPropertyListing({
        ...formData,
        photos: photoPaths,
      });

      console.log("Property listing submitted:", formData);
      alert("Property listing created successfully!");
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}
