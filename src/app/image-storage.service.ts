// image-storage.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImageStorageService {
  private apiUrl = "http://localhost:3000/api"; // Adjust this to your backend URL

  constructor(private http: HttpClient) {}

  // Upload image and return the path
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append("image", file);

    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData);
  }

  // Delete image if needed
  deleteImage(imagePath: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/delete-image?path=${imagePath}`
    );
  }
}
