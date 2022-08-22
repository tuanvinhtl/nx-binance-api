import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, AfterViewInit {
  @ViewChild('myBox') myBox: any;
  @ViewChild('popupRef') popupRef: any;
  popupView = true;
  position: any = {};
  initial = {
    width: 400,
    height: 150,
  };

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    window.addEventListener('resize', this.resizeEventHandler);
  }
  ngAfterViewInit() {
    this.onOpenPopup();
    window.removeEventListener('resize', this.resizeEventHandler);
    this.cdr.detectChanges();
  }

  onOpenPopup() {
    this.popupView = !this.popupView;
    this.calcPosOfBox();
  }
  resizeEventHandler() {
    this.calcPosOfBox();
  }
  calcPosOfBox() {
    const box = this.myBox.nativeElement;

    const popupRef = this.popupRef.nativeElement;

    const width = popupRef.offsetWidth | this.initial.width;
    const height = popupRef.offsetHeight | (this.initial.height + 10);

    const widthOfBox = box.offsetWidth / 2;

    const boundingClientRect = box.getBoundingClientRect();

    const centerPositionX = width / 2;
    const centerPositionY = height / 2;

    const scrollTopPosition = document.documentElement.scrollTop;

    const positionX = `${
      boundingClientRect.x - centerPositionX + widthOfBox
    }px`;
    const positionY = `${
      boundingClientRect.y + 50 + scrollTopPosition + centerPositionY
    }px`;

    this.position = {
      left: positionX,
      top: positionY,
      width: `${this.initial.width}px`,
      height: `${this.initial.height}px`,
    };
  }
}
