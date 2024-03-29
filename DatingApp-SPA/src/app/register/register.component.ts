import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @Output() valuesFromRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  colorTheme = 'theme-orange';
 
  bsConfig?: Partial<BsDatepickerConfig>;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private router :Router
  ) {}

  ngOnInit() {
    // this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.bsConfig = {containerClass:'theme-red'};
    this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // },this.passwordMatchValidator);
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password:['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword:['', Validators.required]
    },{validator : this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch':true}
  }

  register() {
    if(this.registerForm.valid){
      this.user = Object.assign({},this.registerForm.value);
      console.log(this.user);
      this.authService.register(this.user).subscribe(
        () => {
         // this.alertifyService.success("registration succesfull");
        },
        (error) => {
          this.alertifyService.error(error);
        },()=>{
          this.authService.login(this.user).subscribe(
            ()=>{
              this.router.navigate(['/members']);
            } );
        }
      );
    }
   
  }

  cancel() {
    this.valuesFromRegister.emit(false);
  }

  // applyTheme(pop: any) {
  //   // create new object on each property change
  //   // so Angular can catch object reference change
  //   this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  //   setTimeout(() => {
  //     pop.show();
  //   });
  // }
}
