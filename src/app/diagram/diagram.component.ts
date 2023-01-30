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
    EventEmitter,
} from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { map, switchMap } from 'rxjs/operators'
import { from, Observable, Subscription } from 'rxjs'

import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js'

@Component({
    selector: 'app-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.css'],
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {
    private bpmnJS: typeof BpmnJS

    @ViewChild('ref', { static: true }) private el: ElementRef
    @Output() private importDone: EventEmitter<any> = new EventEmitter()

    @Input() url!: string

    constructor(private http: HttpClient) {
        this.bpmnJS = new BpmnJS()

        this.bpmnJS.on('element.click', (event: any) => {
            const element = event.element
            console.log(element.id)
        })
    }

    ngAfterContentInit(): void {
        this.bpmnJS.attachTo(this.el.nativeElement)
    }

    ngOnChanges(changes: SimpleChanges) {
        // re-import whenever the url changes
        if (changes['url']) {
            this.loadUrl(changes['url'].currentValue)
        }
    }

    ngOnDestroy(): void {
        this.bpmnJS.destroy()
    }

    /**
     * Load diagram from URL and emit completion event
     */
    loadUrl(url: string): Subscription {
        return this.http
            .get(url, { responseType: 'text' })
            .pipe(
                switchMap((xml: string) => this.importDiagram(xml)),
                map((result) => result.warnings)
            )
            .subscribe(
                (warnings) => {
                    this.importDone.emit({
                        type: 'success',
                        warnings,
                    })
                },
                (err) => {
                    this.importDone.emit({
                        type: 'error',
                        error: err,
                    })
                }
            )
    }

    /**
     * Creates a Promise to import the given XML into the current
     * BpmnJS instance, then returns it as an Observable.
     *
     * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
     */
    private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
        return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>)
    }

    async downloadDiagram() {
        try {
            const { xml } = await this.bpmnJS.saveXML({ format: true })
            console.log(xml)
        } catch (err) {
            console.error(err)
        }
    }
}
