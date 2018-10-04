import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
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
  data: LoginData = {} as LoginData;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public afAuth: AngularFireAuth) {
  }

  ionViewWillEnter() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.navCtrl.setRoot('TaskListPage');
      }
    })
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
            const loading = this.loadingCtrl.create({
              content: 'SignUp...'
            });
            loading.present();
            this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(res => {
              const toast = this.toastCtrl.create({
                message: 'Sign Up is complited!',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              loading.dismiss();
              this.navCtrl.setRoot('TaskListPage');
            }).catch(err => {
              const toast = this.toastCtrl.create({
                message: err.message,
                position: 'top',
                showCloseButton: true,
                closeButtonText: 'OK'
              });
              loading.dismiss();
              toast.present();
            })
          }
        }
      ]
    });
    alert.present();
  }

  login() {
    const loading = this.loadingCtrl.create({
      content: 'SignUp...'
    });
    loading.present();
    this.afAuth.auth.signInWithEmailAndPassword(
      this.data.email, this.data.password
    ).then(res => {
      const toast = this.toastCtrl.create({
        message: 'Success Login!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      loading.dismiss();
      this.navCtrl.setRoot('TaskListPage');
    }).catch(err => {
      const toast = this.toastCtrl.create({
        message: err.message,
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      toast.present();
      loading.dismiss();
    })
  }

}
