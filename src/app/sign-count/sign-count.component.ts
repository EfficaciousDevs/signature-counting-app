import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SignProxyService } from "../sign-proxy.service";

@Component({
  selector: "app-sign-count",
  templateUrl: "./sign-count.component.html",
  styleUrls: ["./sign-count.component.scss"],
})
export class SignCountComponent implements OnInit {
  @ViewChild("fileUploader") fileUploader: ElementRef;

  constructor(
    private fileUploadService: SignProxyService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.fetchCount().subscribe((data) => {
      this.remainingCounter = data;
    });
  }
  signatureResult: any = null;
  selectedFile: File | null = null;
  fileName: string = null;
  documentData: any;
  file: File = null;
  url: any;
  fileContent: any = null;
  isDisabled: boolean = true;
  uploadedFileContent: string | null = null;
  loader: boolean = false;
  isInvalidState: boolean = false;
  invalidFileType: string = " Invalid File Type";
  toggled: boolean = true;
  remainingCounter: number;
  counterTimeout: boolean = false;

  onChange(event: any): void {
    this.documentData = null;

    this.file = event.target.files[0];

    let snackBarRef = this.snackBar.open(
      "File selected successfully.",
      "close"
    );

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.url = event.target.result;
        this.fileContent = event.target.result;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.fileContent
        );
      };
    }

    setTimeout((): void => {
      snackBarRef.dismiss();
    }, 2000);
  }

  resetFileUploader() {
    this.fileUploader.nativeElement.value = null;
    this.documentData = null;
    this.url = null;
    this.file = null;
    this.fileContent = null;
    this.isInvalidState = false;
    this.loader = false;
    this.selectedFile = null;
    this.signatureResult = null;
  }

  onFileSelected(event: Event): void {
    this.signatureResult = null;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  async fileUploadHandler() {
    if (this.selectedFile) {
      if (this.remainingCounter > 0) {
        this.loader = true;
        (
          await this.fileUploadService.uploadServiceProxy(
            this.selectedFile,
            this.fileName
          )
        ).subscribe((data) => {
          this.authService.checkCount().subscribe((count) => {
            this.remainingCounter = count;
          });
          this.loader = false;
          this.signatureResult = data;

          if (this.signatureResult.status === "P") {
            this.signatureResult.result = this.signatureResult.result.sort(
              (a: any, b: any) => a.page_no - b.page_no
            );
          }
        });
      }
    } else {
      this.snackBar.open("Please select a file in order to upload", "close");
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 2000);
    }
    this.counterTimeout = true;

    setTimeout(() => {
      this.counterTimeout = false;
    }, 5000);
  }
}
