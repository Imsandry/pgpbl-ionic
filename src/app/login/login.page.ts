import { Component, inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  Email = '';
  password = '';

  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);

  async login() {
    if (this.Email && this.password) {
      try {
        await this.authService.login(this.Email, this.password);
        this.navCtrl.navigateRoot('/tabs');
      } catch (error: any) {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
