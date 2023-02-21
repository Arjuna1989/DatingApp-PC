import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() valuesFromRegister = new EventEmitter();
  model: any = {};
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  register() {
    this.authService.register(this.model).subscribe(
      () => {
        this.alertifyService.success("registration succesfull");
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }

  cancel() {
    this.valuesFromRegister.emit(false);
  }
}
