import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';
  imgRta = '';


  constructor(
    private usersService: UsersService,
    private filesService: FilesService,


  ) { }
  downloadPdf() {
    this.filesService.getFile('My PDF', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
      .subscribe()
  }
  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file)
        .subscribe(rta => {
          this.imgRta = rta.location;
        })
    }

  }

  // onLoaded(img: string) {
  //   console.log('log padre', img);
  // }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: "Frank",
      email: 'asdas@gmail.com',
      password: 'dasdasdas'
    })
      .subscribe(rta => {
        console.log(rta);
      })
  }
}
