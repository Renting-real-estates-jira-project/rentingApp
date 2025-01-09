import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("photo", file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  savePhotoData(photoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/photos`, photoData);
  }
}
