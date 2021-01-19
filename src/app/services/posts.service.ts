import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { Post } from "../models/post.module";
import { PostResponseData } from "../models/post-response-data.module";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


const API_URL = environment.API_URL + 'posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
    
    private posts: Post[] = [];
    private postsSubject: Subject<{posts: Post[], totalPosts: number}> = new Subject<{posts: Post[], totalPosts: number}>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getPosts(pageSize: number, currentPage: number): void {
        const queryParams: string = `?size=${pageSize}&page=${currentPage}`;
        this.httpClient
            .get<{message: string, count: number, data: PostResponseData[]}>(API_URL + queryParams)
            .pipe(
                map(dataResponse => {
                    return {
                        posts: dataResponse.data.map(post => {
                            return {
                                id: post._id, 
                                title: post.title, 
                                content: post.content, 
                                imagePath: post.imagePath,
                                creator: post.creator
                            };
                        }),
                        totalPosts: dataResponse.count
                    }
                })
            )
            .subscribe(postData => {
                this.posts = postData.posts;
                this.postsSubject.next({posts: [...this.posts], totalPosts: postData.totalPosts});
            })
    }

    getPost(postId: string) {
        return this.httpClient.get<{message: string, data: PostResponseData}>(API_URL + postId);
    }

    addPost(formData: FormData): void {
        this.httpClient.post<{message: string, data: PostResponseData}>(API_URL, formData)
            .subscribe(response => {
                this.router.navigate(['/']);
            })
    }

    updatePost(formData: FormData): void {
        const postId = formData.get('id');
        this.httpClient.put<{message: string, data: PostResponseData}>(API_URL + postId, formData)
            .subscribe(response => {
                this.router.navigate(['/']);
            })
    }

    deletePost(postId: string): Observable<{message: string, data: PostResponseData}> {
        return this.httpClient.delete<{message: string, data: PostResponseData}>(API_URL + postId);
    }

    convertToPost(post: PostResponseData): Post {
        return {id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator};
    }

    postsChangesListener(): Observable<{posts: Post[], totalPosts: number}> {
        return this.postsSubject.asObservable();
    }
}