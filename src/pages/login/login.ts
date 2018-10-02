import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface LoginData {
  email: string;
  password: string;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  readonly EMAIL_REGEX = "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
  data: LoginData = {} as LoginData;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public afAuth: AngularFireAuth) {
  }

  signUp() {
    let alert = this.alertCtrl.create({
      title: 'SignUp',
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter your E-mail'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Sign Up',
          handler: data => {
            this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(res => {
              const toast = this.toastCtrl.create({
                message: 'Sign Up is complited!',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.navCtrl.setRoot('TaskListPage');
            }).catch(err => {
              const toast = this.toastCtrl.create({
                message: err.message,
                position: 'top',
                showCloseButton: true,
                closeButtonText: 'OK'
              });
              toast.present();
            })
          }
        }
      ]
    });
    alert.present();
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(
      this.data.email, this.data.password
    ).then(res => {
      const toast = this.toastCtrl.create({
        message: 'Success Login!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('TaskListPage');
    }).catch(err => {
      const toast = this.toastCtrl.create({
        message: err.message,
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      toast.present();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
