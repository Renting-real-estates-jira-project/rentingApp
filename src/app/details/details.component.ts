import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housinglocation";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-details",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article class="listing-container">
      <div class="listing-info">
        <div class="listing-header">
          <img
            class="listing-photo"
            [src]="housingLocation?.photo"
            alt="Exterior photo of {{ housingLocation?.name }}"
            crossorigin
          />
          <div class="listing-description">
            <h1 class="listing-heading">{{ housingLocation?.name }}</h1>
            <p class="listing-location">
              {{ housingLocation?.city }}, {{ housingLocation?.state }}
            </p>
          </div>
        </div>

        <section class="listing-details">
          <h2 class="section-heading">Property Details</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Price</span>
              <span class="detail-value">{{
                housingLocation?.price | currency : "USD"
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Area</span>
              <span class="detail-value">{{ housingLocation?.area }} m²</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bedrooms</span>
              <span class="detail-value">{{
                housingLocation?.number_of_bedrooms
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bathrooms</span>
              <span class="detail-value">{{
                housingLocation?.number_of_bathrooms
              }}</span>
            </div>
          </div>
        </section>

        <section class="listing-features">
          <h2 class="section-heading">Amenities</h2>
          <ul class="amenities-list">
            <li>
              <span
                class="amenity-icon"
                [class.available]="housingLocation?.wifi"
              >
                {{ housingLocation?.wifi ? "✓" : "✗" }}
              </span>
              WiFi Available
            </li>
          </ul>
        </section>
      </div>

      <div class="application-form">
        <section class="listing-apply">
          <h2 class="section-heading">Apply now to live here</h2>
          <form [formGroup]="applyForm">
            <div class="form-group">
              <label for="first-name">First Name</label>
              <input
                id="first-name"
                type="text"
                placeholder="Jan"
                formControlName="firstName"
                [class.invalid]="
                  applyForm.get('firstName')?.invalid &&
                  applyForm.get('firstName')?.touched
                "
              />
              <div
                class="error-message"
                *ngIf="
                  applyForm.get('firstName')?.invalid &&
                  applyForm.get('firstName')?.touched
                "
              >
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="last-name">Last Name</label>
              <input
                id="last-name"
                type="text"
                placeholder="Kowalski"
                formControlName="lastName"
                [class.invalid]="
                  applyForm.get('lastName')?.invalid &&
                  applyForm.get('lastName')?.touched
                "
              />
              <div
                class="error-message"
                *ngIf="
                  applyForm.get('lastName')?.invalid &&
                  applyForm.get('lastName')?.touched
                "
              >
                Last name is required
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="kontakt@jankowalski.pl"
                formControlName="email"
                [class.invalid]="
                  applyForm.get('email')?.invalid &&
                  applyForm.get('email')?.touched
                "
              />
              <div
                class="error-message"
                *ngIf="
                  applyForm.get('email')?.invalid &&
                  applyForm.get('email')?.touched
                "
              >
                Please enter a valid email address
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="123456789"
                formControlName="phone"
                [class.invalid]="
                  applyForm.get('phone')?.invalid &&
                  applyForm.get('phone')?.touched
                "
              />
              <div
                class="error-message"
                *ngIf="
                  applyForm.get('phone')?.invalid &&
                  applyForm.get('phone')?.touched
                "
              >
                Please enter a valid phone number
              </div>
            </div>

            <button type="submit" class="primary" [disabled]="!applyForm.valid">
              Apply now
            </button>
          </form>
        </section>
      </div>
    </article>
  `,
  styles: [
    `
      .listing-container {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .listing-header {
        margin-bottom: 2rem;
      }

      .listing-photo {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .listing-heading {
        font-size: 2rem;
        color: #2c3e50;
        margin: 0.5rem 0;
      }

      .listing-location {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 1rem;
      }

      .section-heading {
        font-size: 1.5rem;
        color: #2c3e50;
        margin: 1.5rem 0 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e0e0e0;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1rem 0;
      }

      .detail-item {
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .detail-label {
        font-weight: 600;
        color: #666;
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
      }

      .detail-value {
        font-size: 1.2rem;
        color: #2c3e50;
        font-weight: 500;
      }

      .amenities-list {
        list-style: none;
        padding: 0;
      }

      .amenities-list li {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
      }

      .amenity-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: 0.75rem;
        border-radius: 50%;
        font-weight: bold;
        background-color: #f8f9fa;
      }

      .amenity-icon.available {
        color: #2ecc71;
      }

      .application-form {
        background-color: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        position: sticky;
        top: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
      }

      input.invalid {
        border-color: #e74c3c;
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.375rem;
      }

      button {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
      }

      button:hover:not(:disabled) {
        background-color: #2980b9;
      }

      @media (max-width: 768px) {
        .listing-container {
          grid-template-columns: 1fr;
        }

        .application-form {
          position: static;
          margin-top: 2rem;
        }

        .details-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]{9}$"),
    ]),
  });

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params["id"], 10);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((housingLocation) => {
        this.housingLocation = housingLocation;
      });
  }
}
