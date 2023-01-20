import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

const propertiesPanelModule = require('@bpmn-io/properties-panel');
const BpmnJS = require('bpmn-js/dist/bpmn-modeler.production.min.js');
const Modeler = require('bpmn-js/lib/Modeler.js');

const BpmnColorPickerModule = require('bpmn-js-color-picker');

import { from, Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-diagram',
 templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS: typeof BpmnJS;
  private modeler: typeof Modeler;
  private propertiesPanelModule: typeof propertiesPanelModule;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() url!: string;

  constructor(private http: HttpClient) {

    this.bpmnJS = new BpmnJS();

    // this.bpmnJS.get('canvas').zoom('fit-viewport');

    const mod = this.bpmnJS.get('modeling');

    mod.setColor(['sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26'], {
      stroke: 'blue',
      fill: 'green'
    })

    // this.modeler = new Modeler();

    // const mod = modeler.get('modeling');

    // mod.setColor([], {
    //   stroke: 'green',
    //   fill: 'yellow'
    // });
    // this.bpmnJS.on('import.done', ({ error }: any) => {
    //   if (!error) {
    //     this.bpmnJS.get('canvas').zoom('fit-viewport');
    //   }
    // });
  }

  // ngOnInit(): void {
  //   this.modeler = new Modeler({
  //     container: '#canvas',
  //     propertiesPanel: {
  //       parent: '#properties',
  //     },
  //   });
  //   // this.load();
  // }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }

  async openDiagram(xml: any) {
    try {
      await this.bpmnJS.importXML(xml);
    } catch (err) {
        console.error(err);
    }
}
}
