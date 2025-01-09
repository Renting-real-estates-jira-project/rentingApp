// upload.component.ts
import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-upload",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-group file-upload">
      <label for="photos" class="file-upload-label">
        <span class="upload-icon">📸</span>
        <span class="upload-text">Click to upload photos</span>
        <span class="upload-hint">Supported formats: JPG, PNG (max 5MB)</span>
      </label>
      <input
        id="photos"
        type="file"
        (change)="onFileSelected($event)"
        accept="image/*"
        class="file-input"
        multiple
      />
    </div>
    <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="progress">
      Uploading: {{ uploadProgress }}%
    </div>
    <!-- <div *ngIf="previewUrl">
      <img [src]="previewUrl" class="preview" />
    </div> -->
  `,
  styles: [
    `
      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
      }

      .file-upload {
        margin-top: 1rem;
      }

      .file-upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border: 2px dashed #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.2s, background-color 0.2s;
      }

      .file-upload-label:hover {
        border-color: #3498db;
        background-color: rgba(52, 152, 219, 0.05);
      }

      .upload-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .upload-text {
        font-size: 1.1rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      .upload-hint {
        font-size: 0.9rem;
        color: #666;
      }

      .file-input {
        display: none;
      }

      .progress {
        margin-top: 1rem;
        font-size: 1rem;
        color: #3498db;
      }

      .preview {
        max-width: 200px;
        margin-top: 10px;
      }
    `,
  ],
})
export class UploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.createPreview();
      this.uploadFile();
    }
  }

  private createPreview() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append("photo", this.selectedFile);

    this.http
      .post("http://localhost:3000/upload", formData, {
        reportProgress: true,
        observe: "events",
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === HttpEventType.Response) {
            if (event.body?.filePath) {
              this.imageUploaded.emit(event.body.filePath);
              this.uploadProgress = 0;
            }
          }
        },
        error: (error) => {
          console.error("Upload failed:", error);
          alert("Failed to upload image. Please try again.");
          this.uploadProgress = 0;
        },
      });
  }
}
