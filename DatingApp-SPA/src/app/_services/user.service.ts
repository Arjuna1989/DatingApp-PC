import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";
import { map } from "rxjs/Operators";
import { PaginatedResult } from "../_models/pagination";
import { Params } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token"),
  }),
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?,userParams?,likeParam?): Observable<PaginatedResult<User[]>> {
   const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber',page);
      params = params.append('pageSize',itemsPerPage );
    }
    if(userParams != null){
      params = params.append('gender', userParams.gender) ; 
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('orderBy', userParams.orderBy);

    }

    if(likeParam ==='Likers'){
      params = params.append('likers', 'true');
    }

    if(likeParam ==='Likees'){
      params = params.append('likees', 'true');
    }
    
    return this.http.get<User[]>(this.baseUrl + "users" ,{observe: 'response', params} /*,httpOptions*/)
    .pipe(
      map(response =>{ 
        paginatedResult.result = response.body;
        if(response.headers.get('Pagination')!= null){
          paginatedResult.pagination =JSON.parse(response.headers.get('Pagination'))
        }
        return paginatedResult;
       })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id /*,httpOptions*/);
  }

  UpdateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + "users/" + id, user);
  }
  setMainPhoto (userId:number, id:number)
  {
    return this.http.post(this.baseUrl + 'users/'+userId+'/photos/'+id+'/setMain',{});
  }
  deletePhoto (userId:number, id:number)
  {
    return this.http.delete(this.baseUrl + 'users/'+userId+'/photos/'+id);
  }
  sendLike(userId:number, recipientId:number){
    return this.http.post(this.baseUrl + 'users/'+userId+'/like/'+recipientId,{});
  }
}
