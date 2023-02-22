import { Component, Input, OnInit, Output ,EventEmitter} from "@angular/core";
import { Photo } from "src/app/_models/photo";
import { FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/user.service";
import { AlertifyService } from "src/app/_services/alertify.service";

@Component({
  selector: "app-photo-editor",
  templateUrl: "./photo-editor.component.html",
  styleUrls: ["./photo-editor.component.css"],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  // hasAnotherDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;
  currentMain : Photo;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // public fileOverAnother(e: any): void {
  //   this.hasAnotherDropZoneOver = e;
  // }

  setMainPhoto(photo:Photo) {
    this.userService.setMainPhoto( this.authService.decodedToken.nameid , photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter(p=>p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.getMemberPhotoChange.emit(photo.url);
        this.alertifyService.success("Main photo has been set successfully !");
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      },
      (error) => {
        this.alertifyService.error(error);
      });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "users/" +
        this.authService.decodedToken.nameid +
        "/photos",
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));

        }
      }
    };
  }

  deletePhoto(Photo :Photo){
    this.userService.deletePhoto(this.authService.decodedToken.nameid,Photo.id)
    .subscribe(()=> {
                     this.photos.splice(this.photos.findIndex(p=>p.id ===Photo.id),1);
                     this.alertifyService.success("photo has been deleted successfully");
    },
    (error)=> {this.alertifyService.error(error)}
    );
  }
}
