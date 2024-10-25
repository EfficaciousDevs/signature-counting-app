import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignProxyService {

  constructor(private httpService: HttpClient) {}

  proxyURL = 'http://52.172.252.7:8080/ocrws/signaturews/signcount';
  base64Data: string | null = null;
  fileName: string = null;
  API_KEY = 'Token bd658c5b787d3c40e9984c63d06e2ec250cd1e0d';
  fileCountLeft: number;
  async uploadServiceProxy(file: File, fileName: string): Promise<Observable<any>> {
    // this.convertToBase64(file);
    // this.fileName = fileName;
    // const formData = {
    //   "app_no": "RandomGatewayTokenId", // optional
    //   "filename": this.fileName,
    //   "filedata": this.base64Data
    // };

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': this.API_KEY
    // });

    // return this.httpService.post<any>(this.proxyURL, formData, {headers: headers});



    await this.convertToBase64(file);

    this.fileName = fileName;

    const formData = {
      app_no : 'RandomGatewayTokenId', // optional
      filename : this.fileName,
      filedata: this.base64Data
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.API_KEY
    });

    return this.httpService.post<any>(this.proxyURL, formData, { headers: headers });
  }

  convertToBase64(uploadedFile: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.base64Data = base64String.split(',')[1];
        resolve(this.base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }
}
