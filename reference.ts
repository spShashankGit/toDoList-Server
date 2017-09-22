import { Component } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  names: string[];
  week1: string;
  week2: string;
  week3: string;
  defValues: object;
  tcsContribution: object;
  processes: object;
  getData: boolean;
  postData: boolean;

  //Constructor
  constructor(public navCtrl: NavController, private _http: Http, public plt: Platform, private screenOrientation: ScreenOrientation) {
    this.names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "Edit/Save"];
    this.week1 = "Week 27";
    this.week2 = "Week 28";
    this.week3 = "Week 29";
    this.getData = false;
    this.postData = false;
    this.tcsContribution = {
      "A": 45
    };
    this.defValues = {};

    //Variable Defination
    for (let i in this.names) {
      this.defValues[this.names[i]];
      this.defValues[this.names[i]] = 76;
    };

    //  platform plugin
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
    };
    //  platform plugin
    if (this.plt.isLandscape()) {
      // This will only print when on iOS
      console.log('Landscape');
    }
    //  platform plugin
    if (this.plt.isPortrait()) {
      // This will only print when on iOS
      console.log('Portrait');
    }

    // This will print an array of the current platforms
    console.log(this.plt.platforms());

    plt.ready().then(() => {
      this.plt.pause.subscribe(() => {
        console.log('[INFO] App paused');
        alert("App Paused")
      });

      this.plt.resume.subscribe(() => {
        console.log('[INFO] App resumed');
        //alert("App Resume");
        alert("Speake South 0");
      });
    });

    // window.addEventListener("orientationchange", function() {
    //   console.log(window.orientation);
    //   if(window.orientation == 0)
    //   alert("Speaker South 0 ");
    //   else if(window.orientation ==90)
    //   alert("Speaker East 90");
    //   else if(window.orientation == -90)
    //   alert("Speaker West -90")
    //   else if(window.orientation == 180)
    //   alert("Speaker North 180");

    // }, false);

    // get current
    console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

    // set to landscape
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    // allow user rotate
    //this.screenOrientation.unlock();

    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        console.log("Orientation Changed ", this.screenOrientation.type);
      }
    );


  };

  public valChange(event: any) {

    //       this.touchId.isAvailable()
    //   .then(
    //     res => console.log('TouchID is available!'),
    //     err => console.error('TouchID is not available', err)
    //   );

    // this.touchId.verifyFingerprint('Scan your fingerprint please')
    //   .then(
    //     res => console.log('Ok', res),
    //     err => console.error('Error', err)
    //   );


    this.getData = true;
    const url = "http://3.209.197.75:3000/getData";
    var res = this._http.get(url)
      .map(response => response.json())
      .subscribe((response) => {
        console.log(response);
        this.processes = response;
        this.getData = false;
        //alert("Refreshed!");
      }, (error) => {
        console.log(error);
        this.getData = false;
      });
  }

  updateValChanges(event: any) {
    console.log("Update  called! ", event);
    this.postData = true;

    //Post URL
    const url = "http://3.209.197.75:3000/process_update";

    //Assign Header
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    //console.log("event",event);

    var res = this._http.post(url, JSON.stringify(event), options)
      .subscribe(
      function (response) { console.log("Success Response" + response) },
      function (error) { console.log("Error happened" + error) },
      function () { console.log("the subscription is completed"); alert("Value is updated successfully! Please refresh the content.") }
      );
  };

  postValChanges(event: any) {
    console.log("Post called! ", event);
    this.postData = true;

    //Post URL
    const url = "http://3.209.197.75:3000/process_post";

    //Assign Header
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    //console.log("event",event);

    var res = this._http.post(url, JSON.stringify(event), options)
      .subscribe(
      function (response) { console.log("Success Response" + response) },
      function (error) { console.log("Error happened" + error) },
      function () { console.log("the subscription is completed"); alert("Value Duplicated successfully! Please refresh the content.") }
      );
  };

  deleteValChanges(event: any) {
    console.log("Delete called! ", event);
    this.postData = true;

    //Post URL
    const url = "http://3.209.197.75:3000/process_delete";

    //Assign Header
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    //console.log("event",event);

    var res = this._http.post(url, JSON.stringify(event), options)
      .subscribe(
      function (response) { console.log("Success Response" + response) },
      function (error) { console.log("Error happened" + error) },
      function () { console.log("the subscription is completed"); alert("Record Deleted Successfully! Please refresh the content.") }
      );
    this.valChange(event)
  };

  //Upload File
  public fileChangeEvent(fileInput: any) {
    console.log("fileChange called!! ", fileInput);
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      //     reader.onload = function (e : any) {
      //         $('#preview').attr('src', e.target.result);
      //     }

      //     reader.readAsDataURL(fileInput.target.files[0]);
      // }
    }
  };

  //Lifecycle Hooks
  ngAfterContentInit() {
    console.log("ngAfterContentInit called");
  };
  ngAfterContentChecked() {
    console.log("ngAfterContentChecked called");
  };
  ngAfterViewInit() {
    console.log("ngAfterViewInit called");
  };
  ngAfterViewChecked() {
    console.log("ngAfterViewChecked called");
  };
  ngOnDestroy() {
    console.log("ngOnDestroy called");
  };


  //Ionic lifecycle hooks
  ionViewDidLoad() {
    console.log("I'm alive!");
  };
  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
  };
  ionViewWillEnter() {
    console.log("I'm ionViewWillEnter!");
  };
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  };
  ionViewWillUnload() {
    console.log("I'm ionViewWillUnload!");
  };
  ionViewCanEnter() {
    console.log("Looks ionViewCanEnter");
  };
  ionViewCanLeave() {
    console.log("Looks ionViewCanLeave");
  };



}



