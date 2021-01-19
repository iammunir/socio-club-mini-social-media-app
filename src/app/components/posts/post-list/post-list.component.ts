import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from 'src/app/models/post.module';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private postsChangesSub: Subscription;
  private authStatusSub: Subscription;
  isUserAuthenticated: boolean = false;
  userId: string;
  posts: Post[] = []
  isLoading: boolean = false;
  totalPosts: number = 0;
  pageSize: number = 2;
  currentPage: number = 1;
  pageSizeOptions = [2, 5, 10, 15];

  constructor(private postsService: PostsService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    
    this.postsChangesSub = this.postsService.postsChangesListener()
      .subscribe((postsData: {posts: Post[], totalPosts: number}) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.totalPosts;
        this.isLoading = false;
      });
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(response => this.isUserAuthenticated = response);
  }

  ngOnDestroy() {
    this.postsChangesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  openConfirmationDialog(post) {
    const tobeDeleted = {
      id: post.id,
      title: post.title,
      confirmed: false
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '45%',
      height : 'auto',
      data: tobeDeleted
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        this.onDelete(result.id);
      } else {
        return;
      }
    });
  }

  onDelete(postId: string) {

    this.isLoading = true;
    
    this.totalPosts -= 1;
    if(this.totalPosts <= (this.pageSize * (this.currentPage - 1))) {
      this.currentPage -= 1;
    }

    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
}
