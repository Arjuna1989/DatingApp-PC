import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../_models/user";
import { AlertifyService } from "../../_services/alertify.service";
import { UserService } from "../../_services/user.service";
import { PaginatedResult, Pagination } from "src/app/_models/pagination";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"],
  
})
export class MemberListComponent implements OnInit {
  users: User[];
  user:User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value:'male', display:'Males'},{value:'female',display:'Females'}]
  userParams:any ={};
  pagination:Pagination;
  
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe((data) => {
      this.users = data["users"].result;
      this.pagination = data['users'].pagination;
      this.userParams.gender =  this.user.gender ==='female'?'male':'female';
      this.userParams.minAge = 18;
      this.userParams.maxAge = 99;
      this.userParams.orderBy = 'lastActive';


    });
  }

  

  resetFilters(){
    this.userParams.gender =  this.user.gender ==='female'?'male':'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }
 

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
      (res: PaginatedResult<User[]>) => {
        this.users = res.result;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
}
