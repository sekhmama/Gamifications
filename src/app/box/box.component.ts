import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('split0',[
      transition(':leave',[
      style({opacity: '{{opac0}}'}),
      animate('0.25s',style({transform: 'translateY(-40px)translateX(10px)', opacity:'{{opac0}}'})),
  ])
  ]),
    trigger('split1',[
      transition(':leave',[
      style({opacity:'{{opac1}}'}),
      animate('0.25s',style({transform: 'translateY(10px)translateX(40px)', opacity:'{{opac1}}'})),
  ])
  ]),
    trigger('split2',[
      transition(':leave',[
      style({opacity:'{{opac2}}'}),
      animate('0.25s',style({transform: 'translateY(-20px)translateX(-40px)', opacity:'{{opac2}}'})),
  ])
  ]),
    trigger('split3',[
      transition(':leave',[
      style({opacity:'{{opac3}}'}),
      animate('0.25s',style({transform: 'translateY(40px)translateX(-10px)', opacity:'{{opac3}}'})),
  ])
  ]),
],
})
export class BoxComponent implements OnInit, OnChanges{
public opacity0 =1;
public opacity2 =1;
public opacity3 =1;
public opacity1 =1;
constructor(private cf: ChangeDetectorRef ){}

@Input() m: number = 6;
@Input() n: number = 12;
@Input() top: any;
@Input() left: any;
@Input() bottom: any;
@Input() right: any;
@Input() untouch: any = false;
@Input() param: any= 0;
@Input() player: any= 0;
@Input() colors: any= {};
@Output() exit= new EventEmitter<string>();
val:any = '0';
l = 4;
x=0;
y=0;
color:any;
// colors: any = {
//   0: 'red',
//   1: 'blue',
//   2: 'green',
//   3: 'yellow',
//   4: 'orange',
//   5: 'pink',
//   6: 'brown',
//   7: 'purple',
// }
ngOnInit() {
  this.onMatrix(this.param);
}
onMatrix(i:number){
  this.l = 4;
   this.y=Math.floor(i/this.m);
   this.x=(i%this.m);
  if(this.x === 0){
    this.l=this.l-1;
    console.log(this.l);
    this.opacity2=0;
  }
  else{
    this.opacity2=1;
  }
  if(this.y === this.n-1){
    this.l=this.l-1;
    this.opacity3 = 0;
  }
  else{
    this.opacity3=1;
  }
  if(this.x === this.m-1){
    this.l=this.l-1;
    this.opacity1= 0;
  }
  else{
    this.opacity1=1;
  }
  if(this.y === 0){
    this.l=this.l-1;
    this.opacity0 = 0;
  }
  else{
    this.opacity0=1;
  }
}
ngOnChanges(changes: SimpleChanges): void {
  if(changes['colors'] && changes['colors'].previousValue && changes['colors'].currentValue.length < changes['colors'].previousValue.length && this.prevPlayer!=='*'){
    for(let i=0; i<changes['colors'].currentValue.length; i++){
      if(this.color === changes['colors'].currentValue[i]){
        this.val = i.toString()+'c'+this.val.slice(2,-1)+((this.value).toString());
        this.exit.emit(this.val);
        return;
      }
    }
  }
  let change = false;
  if(changes['top'] && changes['top'].previousValue && changes['top'].previousValue.length < changes['top'].currentValue.length){
  this.onChain();
    change = true;
  }
  if(changes['bottom'] && changes['bottom'].previousValue && changes['bottom'].previousValue.length < changes['bottom'].currentValue.length){
  this.onChain();
    change = true;
  }
  if(changes['left'] && changes['left'].previousValue && changes['left'].previousValue.length < changes['left'].currentValue.length){
  this.onChain();
    change = true;
  }
  if(changes['right'] && changes['right'].previousValue && changes['right'].previousValue.length < changes['right'].currentValue.length){
  this.onChain();
    change = true;
  }
  if(change){
    setTimeout(()=>{
      this.exit.emit(this.val);
    },0);
  }
}
onAdd(){
  if(this.untouch || (!['*',this.prevPlayer].includes(this.player) && this.value > 0))
    return;
  if(this.value === this.l-1){
    this.val=this.val.slice(0,-1)+'4';
    this.color = this.colors[this.player];
    setTimeout(()=>{
      this.val = this.val+'0';
      this.val = '*'+'m'+this.val.slice(2,-1)+'0';
      // this.cf.detectChanges();
    },0);
  } else {
    this.color = this.colors[this.player];
    this.val = this.player.toString()+'m'+this.val.slice(2,-1)+((this.value+1).toString());
    
  }
    setTimeout(()=>{
    this.exit.emit(this.val);
    // this.cf.detectChanges();
  },0);
}
onChain(){
  if(this.value === this.l-1){
    this.val=this.val.slice(0,-1)+'4';
    this.color = this.colors[this.player];
    setTimeout(()=>{
      this.val = this.val+'0';
      this.val = '*'+'a'+this.val.slice(2,-1)+'0';
    },0);
  } else {
    this.color = this.colors[this.player];
    this.val = this.player.toString()+'a'+this.val.slice(2,-1)+((this.value+1).toString());
  }
}
get value(){
  return parseInt(this.val[this.val.length - 1],10);
}
get prevPlayer(){
  if (this.val[0] === '*')
    return '*';
  return parseInt(this.val[0],10);
}
}
