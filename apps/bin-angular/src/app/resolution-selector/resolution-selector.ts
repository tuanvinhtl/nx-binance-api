import { Component, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-resolution-selector',
  templateUrl: './resolution-selector.html',
  styleUrls: ['./resolution-selector.scss'],
})
export class ResolutionSelectorComponent implements OnInit {
  selected = '1D';
  resolutionTimesPicked: any = [];
  opendPopup = false;
  relutionList = [
    {
      label: 'Time',
      value: 'Time',
    },
    {
      label: '1m',
      value: '1m',
    },
    {
      label: '3m',
      value: '3m',
    },
    {
      label: '5m',
      value: '5m',
    },
    {
      label: '30m',
      value: '30m',
    },
    {
      label: '1H',
      value: '1H',
    },
    {
      label: '2H',
      value: '2H',
    },
    {
      label: '4H',
      value: '4H',
    },
    {
      label: '1D',
      value: '1D',
    },
    {
      label: '1W',
      value: '1W',
    },
  ];

  clickedRelutionTime(data: any) {
    this.selected = data.value;
  }
  onResTimesPicked(relus: any) {
    const findResult = this.resolutionTimesPicked.find(
      (x: any) => x.value === relus.value
    );
    if (!findResult) {
      this.resolutionTimesPicked.push(relus);
    } else {
      this.resolutionTimesPicked = this.resolutionTimesPicked.filter(
        (y: any) => y.value !== relus.value
      );
    }

    localStorage.setItem(
      'RELUTION_TIMES',
      JSON.stringify(this.resolutionTimesPicked)
    );
  }

  maskedCheck(relus: any) {
    return this.resolutionTimesPicked.find((x: any) => x.value === relus.value);
  }

  getItems() {
    const relus = localStorage.getItem('RELUTION_TIMES') as any;
    this.resolutionTimesPicked = JSON.parse(relus)
  }

  ngOnInit(): void {
    this.getItems();
  }
}
