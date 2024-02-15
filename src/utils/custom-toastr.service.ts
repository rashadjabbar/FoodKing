import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastr: ToastrService) { }

  message(message: string, title: string, toastrOptions: Partial<ToastrOptions>) {

    this.toastr[toastrOptions.messageType ?? ToastrMessageType.Info](message, title, {
      positionClass: toastrOptions.position ?? ToastrPosition.BottomCenter,
      progressBar: toastrOptions.progressBar ?? true
    });
  }
}


export class ToastrOptions{
  messageType?: ToastrMessageType;
  position?: ToastrPosition;
  progressBar?: boolean = true;
  //delay: number = 1;
  //dissmisOthers: boolean = false;
}

export enum ToastrMessageType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

export enum ToastrPosition {
  BottomRight = 'toast-bottom-right',
  BottomCenter = 'toast-bottom-center',
  BottomLeft = 'toast-bottom-left',
  BottomFullWidth = 'toast-bottom-full-width',
  TopRight = 'toast-top-right',
  TopCenter = 'toast-top-center',
  TopLeft = 'toast-top-left',
  TopFullWidth = 'toast-top-full-width',
}

