import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the TaskListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {

  taskList: {name: string}[] = [];

  constructor(public navCtrl: NavController,
              public afAuth: AngularFireAuth) {
  }

  ionViewWillEnter() {
    // 認証がなければログイン画面へ
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot('LoginPage');
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot('LoginPage');
  }

}
