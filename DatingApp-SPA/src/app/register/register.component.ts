import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@Output() valuesFromRegister = new EventEmitter();
  model:any ={};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(()=>{
      console.log('registration succesfull');
    }, error => {
console.log(error);
    })
  }

  cancel(){
    this.valuesFromRegister.emit(false);
  }

}
