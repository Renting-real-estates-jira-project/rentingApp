import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingLocation } from "../housinglocation";
import { HousingService } from "../housing.service";
import { FilterCriteria } from "../filtercriteria";
@Component({
  selector: "app-home",
  imports: [CommonModule, FormsModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <div class="filters">
          <!-- Name Filter and Search Button -->
          <div class="filter-group inline-group">
            <input
              type="text"
              [(ngModel)]="filters.name"
              name="name"
              placeholder="Search by name"
              class="full-width"
            />
            <button
              class="primary search-btn"
              type="button"
              (click)="applyFilters()"
            >
              Search
            </button>
          </div>

          <!-- Show Filters and Clear Filters Buttons -->
          <div class="filter-group inline-group">
            <button
              type="button"
              class="toggle-filters-btn"
              (click)="showFilters = !showFilters"
            >
              {{ showFilters ? "Hide Filters" : "Show Filters" }}
            </button>
            <button
              type="button"
              class="clear-filters-btn"
              (click)="clearFilters()"
            >
              Clear Filters
            </button>
          </div>

          <!-- Additional Filters (Show/Hide Based on Toggle) -->
          <div *ngIf="showFilters">
            <!-- Price and Area Filters in One Line -->
            <div class="filter-group inline-group">
              <!-- Price Range -->
              <div class="range-group">
                <label class="range-label">Rental price (zł):</label>
                <div class="range-inputs">
                  <input
                    type="number"
                    [(ngModel)]="filters.priceMin"
                    name="priceMin"
                    placeholder="Min price"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.priceMax"
                    name="priceMax"
                    placeholder="Max price"
                    min="0"
                  />
                </div>
              </div>

              <!-- Area Range -->
              <div class="range-group">
                <label class="range-label">Area (m²):</label>
                <div class="range-inputs">
                  <input
                    type="number"
                    [(ngModel)]="filters.areaMin"
                    name="areaMin"
                    placeholder="Min area"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.areaMax"
                    name="areaMax"
                    placeholder="Max area"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <!-- Bedrooms and Bathrooms Filters in One Line -->
            <div class="filter-group inline-group">
              <!-- Bedrooms Range -->
              <div class="range-group">
                <label class="range-label">Bedrooms:</label>
                <div class="range-inputs">
                  <input
                    type="number"
                    [(ngModel)]="filters.bedroomsMin"
                    name="bedroomsMin"
                    placeholder="Min"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.bedroomsMax"
                    name="bedroomsMax"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>

              <!-- Bathrooms Range -->
              <div class="range-group">
                <label class="range-label">Bathrooms:</label>
                <div class="range-inputs">
                  <input
                    type="number"
                    [(ngModel)]="filters.bathroomsMin"
                    name="bathroomsMin"
                    placeholder="Min"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.bathroomsMax"
                    name="bathroomsMax"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div class="filter-group amenities">
              <label>
                <input type="checkbox" [(ngModel)]="filters.wifi" name="wifi" />
                WiFi Available
              </label>
            </div>
          </div>
        </div>
      </form>
    </section>

    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      ></app-housing-location>
    </section>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];
  showFilters = false;
  filters: FilterCriteria = {
    name: "",
    city: "",
    state: "",
    priceMin: 0,
    priceMax: 0,
    areaMin: 0,
    areaMax: 0,
    bedroomsMin: 0,
    bedroomsMax: 0,
    bathroomsMin: 0,
    bathroomsMax: 0,
    wifi: false,
  };
  constructor() {
    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = this.housingLocationList;
      });
  }
  applyFilters() {
    this.filteredLocationList = this.housingLocationList.filter((location) => {
      const matchesName =
        !this.filters.name ||
        location.name.toLowerCase().includes(this.filters.name.toLowerCase());

      const matchesCity =
        !this.filters.city ||
        location.city.toLowerCase().includes(this.filters.city.toLowerCase());

      const matchesState =
        !this.filters.state ||
        location.state.toLowerCase().includes(this.filters.state.toLowerCase());

      const matchesPriceMin =
        !this.filters.priceMin || location.price >= this.filters.priceMin;

      const matchesPriceMax =
        !this.filters.priceMax || location.price <= this.filters.priceMax;

      const matchesAreaMin =
        !this.filters.areaMin || location.area >= this.filters.areaMin;

      const matchesAreaMax =
        !this.filters.areaMax || location.area <= this.filters.areaMax;

      const matchesBedroomsMin =
        !this.filters.bedroomsMin ||
        location.number_of_bedrooms >= this.filters.bedroomsMin;

      const matchesBedroomsMax =
        !this.filters.bedroomsMax ||
        location.number_of_bedrooms <= this.filters.bedroomsMax;

      const matchesBathroomsMin =
        !this.filters.bathroomsMin ||
        location.number_of_bathrooms >= this.filters.bathroomsMin;

      const matchesBathroomsMax =
        !this.filters.bathroomsMax ||
        location.number_of_bathrooms <= this.filters.bathroomsMax;

      const matchesWifi = !this.filters.wifi || location.wifi;

      return (
        matchesName &&
        matchesCity &&
        matchesState &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesAreaMin &&
        matchesAreaMax &&
        matchesBedroomsMin &&
        matchesBedroomsMax &&
        matchesBathroomsMin &&
        matchesBathroomsMax &&
        matchesWifi
      );
    });
  }

  clearFilters() {
    this.filters = {
      name: "",
      city: "",
      state: "",
      priceMin: 0,
      priceMax: 0,
      areaMin: 0,
      areaMax: 0,
      bedroomsMin: 0,
      bedroomsMax: 0,
      bathroomsMin: 0,
      bathroomsMax: 0,
      wifi: false,
    };
    this.filteredLocationList = this.housingLocationList;
  }
}
