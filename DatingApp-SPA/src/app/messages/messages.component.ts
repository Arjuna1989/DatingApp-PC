import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private authService :AuthService, private route: ActivatedRoute, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    })
  }

  loadMessage(){
    this.userService.getMessages(this.authService.decodedToken.nameid,this.pagination.currentPage , this.pagination.itemsPerPage,this.messageContainer)
    .subscribe((response :PaginatedResult<Message[]>) =>{
      this.messages = response.result;
      this.pagination = response.pagination;
    },(error) =>{
      this.alertifyService.error(error)
    })
  }

  pageChanged(event: any):void{
    this.pagination.currentPage = event.page;
    this.loadMessage();
  }
 
  deleteMessage(id:number){
    this.alertifyService.confirm("Are you sure want to delete the message ?",
     ()=>{
      this.userService.deleteMessage(id,this.authService.decodedToken.nameid).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(m=>m.id ===id),1);
        this.alertifyService.success('Message has been deleted');
      }, (error) =>{
        this.alertifyService.error(error);
      });
    })
  }
}
