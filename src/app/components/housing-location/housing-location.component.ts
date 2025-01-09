import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HousingLocation } from "../../interfaces/housinglocation";
import { RouterModule } from "@angular/router";
@Component({
  selector: "app-housing-location",
  imports: [CommonModule, RouterModule],
  template: `
    <section class="listing">
      <img
        class="listing-photo"
        [src]="photoUrl"
        alt="Exterior photo of {{ housingLocation.name }}"
        crossorigin
      />
      <h2 class="listing-heading">{{ housingLocation.name }}</h2>
      <p class="listing-location">
        {{ housingLocation.city }}, {{ housingLocation.state }}
      </p>
      <a [routerLink]="['/details', housingLocation.id]">Learn More</a>
    </section>
  `,
  styleUrls: ["./housing-location.component.css"],
})
export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocation;
  get photoUrl(): string {
    return this.housingLocation.photos && this.housingLocation.photos.length > 0
      ? `http://localhost:3000${this.housingLocation.photos[0]}`
      : "/assets/default-photo.jpg"; // Fallback image path
  }
}
