import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { Subject, debounceTime, map, switchMap } from 'rxjs';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, BoxComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  playing = false;
  untouch: any = false;
  dummy2: any = 0;
  timeoutId: any;
  clickCount: number =0;
  winner= '';
  // touchDebouncer = new Subject<string>();

  constructor(private cf: ChangeDetectorRef) { }
  dummy = 0;
  playerLimit = 0;
  loginForm = new FormGroup({
    count: new FormControl({ value: 2, disabled: false }, [
      Validators.required, Validators.min(2), Validators.max(8)
    ]),
  });


  // dummy = [0].constructor(6);
  // matrix = this.dummy.constructor(12);
  columns = 6;
  rows = 12;
  boxes = this.columns * this.rows;
  matrix1 = [
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
    ['*m0', '*m0', '*m0', '*m0', '*m0', '*m0'],
  ]
  matrix:any=[];

  gamers1 = [
    { id: 'test0' },
    { id: 'test1' },
    { id: 'test2' },
    { id: 'test3' },
    { id: 'test4' },
    { id: 'test5' },
    { id: 'test6' },
    { id: 'test7' },
  ]

  colors1: any = [
    'red',
    'blue',
    'green',
    'violet',
    'yellow',
    'orange',
    'white',
    'grey',
  ]
  gamers:any=[];
  colors:any=[];

  player = 0;
  color: any = this.colors[0];

  ngOnInit() {
    // this.enableTouch();
    // this.touchDebouncer.next('a');
  }

  onSubmit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.playing = true;
      this.gamers = this.gamers1.slice(0,this.loginForm.value['count']? this.loginForm.value['count']:2);
      this.colors = this.colors1.slice(0,this.loginForm.value['count']? this.loginForm.value['count']:2);
      this.matrix = JSON.parse(JSON.stringify(this.matrix1));
      this.player = 0;
      this.color = this.colors[0];
      this.untouch = false;
      this.clickCount = 0;
      window.navigator.vibrate([200, 100, 200]);
      this.cf.detectChanges();
    }
  }
  // matrix = new Array(12).fill(JSON.parse(JSON.stringify(new Array(6).fill(0))));
  onMatrix(i: number) {
    const y = Math.floor(i / this.columns);
    const x = (i % this.columns);
    return [x, y];
  }
  onTop(i: number) {
    const [x, y] = this.onMatrix(i);
    // y-1 < 0 || console.log(x,y,'top is',x,y-1);
    return y - 1 < 0 ? null : this.matrix[y - 1][x];
  }
  onBottom(i: number) {
    const [x, y] = this.onMatrix(i);
    // y+1 >= 12 || console.log(x,y,'bottom is',x,y+1);
    return y + 1 >= this.rows ? null : this.matrix[y + 1][x];
  }
  onLeft(i: number) {
    const [x, y] = this.onMatrix(i);
    // x-1 < 0 || console.log(x,y,'left is',x-1,y);
    return x - 1 < 0 ? null : this.matrix[y][x - 1];
  }
  onRight(i: number) {
    const [x, y] = this.onMatrix(i);
    // x+1 >= 6 || console.log(x,y,'right is',x+1,y);
    return x + 1 >= this.columns ? null : this.matrix[y][x + 1];
  }
  onUpdate(i: number, val: any) {
    this.untouch = true;

    if(val[1] === 'c'){
      const [x, y] = this.onMatrix(i);
      this.matrix[y][x] = val;
      this.untouch = false;
      this.cf.detectChanges();
      return;
    }

    setTimeout(() => {
      const [x, y] = this.onMatrix(i);
      this.matrix[y][x] = val;
      this.cf.detectChanges();
    }, 250);

    if (this.timeoutId)
      clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(async() => {
      this.clickCount++;
      if(this.clickCount > this.gamers.length)
      var check:any =  await this.gameCheck();
      if(check === null){
        return;
      }
      this.untouch = false;
      // if(val[1] === 'm'){
      if (this.player == this.gamers.length - 1)
        this.player = 0;
      else
        this.player = this.player + 1;
      // }
      this.color = this.colors[this.player];
      this.cf.detectChanges();
    }, 300);

    // console.log(this.matrix[y][x],x,y);
  }

  // enableTouch(){
  //   this.touchDebouncer.pipe(
  //     // map((event: any) => event.target.value),
  //     debounceTime(250),
  //     // distinctUntilChanged(),
  //     switchMap(v => {
  //       // debouncer.next(searchTerm);
  //       // return debouncer.asObservable();
  //       return v;
  //     })
  //   )
  //   .subscribe(v => {
  //  if(this.player == this.gamers.length-1)
  //    this.player = 0;
  //  else
  //    this.player = this.player+1;
  //  this.color = this.colors[this.player];
  //  this.untouch = false;
  //    });
  // }

  async gameCheck() {
    let checkObj: any = {};
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if(this.matrix[i][j][0] !== '*' && !checkObj[parseInt(this.matrix[i][j][0],10)]){
          checkObj[parseInt(this.matrix[i][j][0],10)] = 'exists';
        } 
      }
    }
    const dupGamers: any = []; 
    const dupColors = []; 
    for (let i = 0; i < this.gamers.length; i++) {
      if(checkObj[i]){
        dupGamers.push(this.gamers[i]);
        dupColors.push(this.colors[i]);
        if(this.player === i){
          this.player = dupGamers.length-1;
        }
      }
    }
    // after optimising change code to check for each auto change
    if(dupGamers.length === 1){
      window.navigator.vibrate([100, 50, 100, 50, 200]);
      this.winner = dupColors[0];
      setTimeout(async() => {
        alert(`Congratulations! ${this.winner} has won the game`);
        this.playing = false;
        this.winner = '';
        this.cf.detectChanges();
        return null;
      },500);
    } else{
      this.gamers = dupGamers;
      this.colors = dupColors;
    }
    return this.player;
  }

  ngOnDestroy(): void {
    //   this.touchDebouncer.unsubscribe();
  }
}