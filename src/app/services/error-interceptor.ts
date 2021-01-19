import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "../components/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((errorResponse: HttpErrorResponse) => {

                let errorMessage = 'An unknown error occurred!';
                if (errorResponse) {
                    errorMessage = errorResponse.error.message
                }
                
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                return throwError(errorResponse);
            }));
    }
}