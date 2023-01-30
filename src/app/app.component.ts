import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'bpmn-js-angular'
    // diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
    diagramUrl = 'https://bpmn.io/assets/attachments/blog/2016/colors.bpmn'
    importError?: Error

    handleImported(event: any) {
        const { type, error, warnings } = event

        if (type === 'success') {
            console.log(`Rendered diagram (%s warnings)`, warnings.length)
        }

        if (type === 'error') {
            console.error('Failed to render diagram', error)
        }

        this.importError = error
    }
}
