import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="file-upload-container">
      <div class="upload-area" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        
        <input #fileInput 
               type="file" 
               [accept]="acceptedTypes" 
               [multiple]="multiple"
               (change)="onFileSelected($event)"
               style="display: none;">
        
        <div class="upload-content" *ngIf="!isUploading && files.length === 0">
          <mat-icon class="upload-icon">cloud_upload</mat-icon>
          <h3>Drop files here or click to browse</h3>
          <p>Supported formats: {{acceptedTypes}}</p>
          <p>Maximum file size: {{maxSizeMB}}MB</p>
        </div>
        
        <div class="upload-progress" *ngIf="isUploading">
          <mat-icon>upload_file</mat-icon>
          <p>Uploading...</p>
          <mat-progress-bar [value]="uploadProgress" mode="determinate"></mat-progress-bar>
        </div>
        
        <div class="uploaded-files" *ngIf="files.length > 0 && !isUploading">
          <div class="file-item" *ngFor="let file of files; let i = index">
            <mat-icon>description</mat-icon>
            <div class="file-info">
              <span class="file-name">{{file.name}}</span>
              <span class="file-size">{{formatFileSize(file.size)}}</span>
            </div>
            <button mat-icon-button (click)="removeFile(i)" color="warn">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </div>
      
      <div class="upload-actions" *ngIf="files.length > 0 && !isUploading">
        <button mat-raised-button color="primary" (click)="uploadFiles()">
          <mat-icon>cloud_upload</mat-icon>
          Upload {{files.length}} file(s)
        </button>
        <button mat-button (click)="clearFiles()">
          <mat-icon>clear</mat-icon>
          Clear All
        </button>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      width: 100%;
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;
    }

    .upload-area:hover,
    .upload-area.dragover {
      border-color: #3f51b5;
      background: #f3f4f6;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
    }

    .upload-content h3 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .upload-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .upload-progress mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3f51b5;
    }

    .upload-progress mat-progress-bar {
      width: 200px;
    }

    .uploaded-files {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 200px;
      overflow-y: auto;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .file-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .file-name {
      font-weight: 500;
      color: #333;
    }

    .file-size {
      font-size: 12px;
      color: #666;
    }

    .upload-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .upload-area {
        padding: 20px 16px;
      }
      
      .upload-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FileUploadComponent {
  @Input() acceptedTypes = '.pdf,.doc,.docx';
  @Input() maxSizeMB = 5;
  @Input() multiple = false;
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() uploadComplete = new EventEmitter<any>();

  files: File[] = [];
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.handleFiles(files);
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files || []) as File[];
    this.handleFiles(files);
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter(file => this.isValidFile(file));
    
    if (this.multiple) {
      this.files = [...this.files, ...validFiles];
    } else {
      this.files = validFiles.slice(0, 1);
    }
    
    this.filesSelected.emit(this.files);
  }

  private isValidFile(file: File): boolean {
    const maxSize = this.maxSizeMB * 1024 * 1024;
    return file.size <= maxSize;
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.filesSelected.emit(this.files);
  }

  clearFiles(): void {
    this.files = [];
    this.filesSelected.emit(this.files);
  }

  uploadFiles(): void {
    if (this.files.length === 0) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        this.uploadComplete.emit(this.files);
      }
    }, 200);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}