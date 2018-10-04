import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the TaskListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Task {
  key?: string;
  name: string;
}

@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {
  readonly TASK_BASE_URL = 'tasks';
  readonly SEP = '/';

  myUrl: string;
  taskList: Task[] = [];

  constructor(public ngZone: NgZone,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase) {
  }

  ionViewWillEnter() {
    // 認証がなければログイン画面へ
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot('LoginPage');
      } else {
        this.myUrl = [this.TASK_BASE_URL, user.uid].join(this.SEP);
        this.afDB.database.ref(
          this.myUrl
        ).on('value', response => {
          if (response) {
            this.ngZone.run(() => {
              this.taskList = [];
              response.forEach(child => {
                const task = child.val() as Task;
                task.key = child.key;
                this.taskList.push(task);
              });
            })
          }
        });
      }
    });
  }

  onAdd() {
    const alert = this.alertCtrl.create({
      title: '新規作成',
      inputs: [
        {type: 'text', label: 'name', name: 'name'}
      ],
      buttons: [
        {text: '保存', handler: (data) => this.addTask({name: data.name})},
        {text: 'キャンセル', role: 'cancel'}
      ]
    });
    alert.present();
  }

  addTask(task: Task) {
    this.afDB.database.ref(this.myUrl).push(task);
  }

  onDelete(task: Task) {
    const alert = this.alertCtrl.create({
      title: '削除',
      subTitle: 'タスクを削除します',
      buttons: [
        {text: 'OK', handler: () => this.deleteTask(task)},
        {text: 'キャンセル', role: 'cancel'}
      ]
    });
    alert.present();
  } 

  deleteTask(task: Task) {
    if (task.key) {
      this.afDB.database.ref([this.myUrl, task.key].join(this.SEP)).remove();
    } else {
      const toast = this.toastCtrl.create({
        message: '削除に失敗しました',
        duration: 3000
      });
      toast.present();
    }
  }

  onEdit(task: Task) {
    const alert = this.alertCtrl.create({
      title: '編集',
      inputs: [
        {type: 'text', label: 'name', name: 'name', value: task.name}
      ],
      buttons: [
        {text: '保存', handler: (data) => {
          task.name = data.name;
          this.updateTask(task);
        }},
        {text: 'キャンセル', role: 'cancel'}
      ]
    });
    alert.present();
  }

  updateTask(task: Task) {
    if (task.key) {
      this.afDB.database.ref([this.myUrl, task.key].join(this.SEP)).set(task);
    } else {
      const toast = this.toastCtrl.create({
        message: '更新に失敗しました',
        duration: 3000
      });
      toast.present();
    }
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
