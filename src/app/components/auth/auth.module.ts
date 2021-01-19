import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AngularMaterialModule,
        AuthRoutingModule,
    ] 
})
export class AuthModule {}