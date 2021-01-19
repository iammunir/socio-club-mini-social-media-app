import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "src/app/angular-material.module";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
    declarations: [
        PostListComponent,
        PostCreateComponent,
        ConfirmationComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AngularMaterialModule,
        ReactiveFormsModule,
    ]
})
export class PostModule {}