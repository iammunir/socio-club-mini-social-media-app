import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { title } from 'process';

import { Post } from 'src/app/models/post.module';
import { PostsService } from 'src/app/services/posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode: string;
  private postId: string;
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  getFile: boolean;
  imagePreview: string;

  constructor(private postsService: PostsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this,this.isLoading = true;
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId)
          .subscribe(response => {
            this.post = this.postsService.convertToPost(response.data);
            this.form.setValue({
              title: this.post.title, 
              content: this.post.content,
              image: this.post.imagePath
            });
            this.imagePreview = this.post.imagePath;
            this.isLoading = false;
          });        
      } else {
        this.mode = 'create';
        this.postId = null
      }
    })
  }

  onSelectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    this.getFile = true;

    // get the preview image
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    }
    fileReader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const formData = new FormData();
    formData.append('id', this.postId);
    formData.append('title', this.form.value.title);
    formData.append('content', this.form.value.content);
    
    const image = this.form.value.image;
    if (typeof image === 'object') {
      formData.append('image', this.form.value.image, this.form.value.title);
    } else {
      formData.append('image', image);
    }
    
    if (this.mode === 'create') {
      this.postsService.addPost(formData);
      this.form.reset();
    } else {
      this.postsService.updatePost(formData);
    }
  }



}
