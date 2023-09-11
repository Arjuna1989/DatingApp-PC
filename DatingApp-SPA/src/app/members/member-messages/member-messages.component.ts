import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/Operators";
import { Message } from "src/app/_models/message";
import { User } from "src/app/_models/user";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-member-messages",
  templateUrl: "./member-messages.component.html",
  styleUrls: ["./member-messages.component.css"],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  user: User;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alrtify: AlertifyService,
    private routes: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadMessages();
    this.routes.data.subscribe((data) => {
      this.user = data["user"];
    });
  }

  loadMessages() {
    const currentUserId =+this.authService.decodedToken.nameid;
    this.userService
      .getMessageThread(currentUserId, this.recipientId)
      .pipe(
        tap(messages => {
              for(let i=0; i<messages.length; i++){
                if(messages[i].isRead === false && messages[i].recipientId === currentUserId){
                  this.userService.markAsRead(currentUserId, messages[i].id);
              }
            }
        })
      )
      .subscribe(
        (response) => {
          this.messages = response;
        },
        (error) => {
          this.alrtify.error(error.error.message);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          console.log(message);
          this.messages.unshift(message);
          this.newMessage.noContent = "";
        },
        (error) => {
          this.alrtify.error(error);
        }
      );
  }

 
}
