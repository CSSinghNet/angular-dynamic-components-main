import { CommonModule, NgClass } from "@angular/common";
import { Component, inject, ViewContainerRef, signal, inputBinding, twoWayBinding, outputBinding, effect } from "@angular/core";
import { DynamicFormControlComponent } from "./dynamic-formControl.Component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-dynamic-host',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div class="container py-5">
      <h2>Angular v20 Dynamic Component Demo</h2>
      <p>Using declarative bindings + two-way + directives</p>

      <div class="mb-4">
        <label class="form-label">Parent control value:</label>
        <input 
          type="text" 
          class="form-control" 
          [(ngModel)]="parentValue" 
          placeholder="Type here to see two-way binding"
        />
      </div>

      <button class="btn btn-success me-2" (click)="createComponent()">
        Create Dynamic Form Control
      </button>

      <button class="btn btn-outline-secondary" (click)="clear()">
        Clear / Destroy
      </button>

      <div #container class="mt-4 border p-4 rounded"></div>

      @if (lastSubmitted()) {
        <div class="alert alert-success mt-3">
          Submitted value: <strong>{{ lastSubmitted() }}</strong>
        </div>
      }
    </div>
  `
})
export class DynamicHostComponent {
  private vcr = inject(ViewContainerRef);
  private componentRef: any = null;

  parentValue = 'Initial value';
  lastSubmitted = signal<string | null>(null);

  createComponent() {
    // Clean up previous instance if exists
    this.vcr.clear();

    this.componentRef = this.vcr.createComponent(DynamicFormControlComponent, {
      bindings: [
        // Regular input (can be signal or static)
        inputBinding('label', () => 'Your name'),
        twoWayBinding('value', this.parentSignal),
        outputBinding('onSubmit', (value: string) => {
          this.lastSubmitted.set(value);
          console.log('Submitted from dynamic component:', value);
        })
      ],

      // Dynamically apply directives (host directives)
      directives: [
        NgClass,  // ← just as example — can be your custom ones too
        // Example with inputs:
        // { directive: HighlightDirective, inputs: { color: 'lightblue' } }
      ]
    });

    console.log('Dynamic component created with declarative bindings');
  }

  clear() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
      this.lastSubmitted.set(null);
    }
  }

  // Signal used for two-way binding demo
  parentSignal = signal<string>('');

  constructor() {
    // Keep parent ↔ child in sync both ways
    effect(() => {
      const val = this.parentValue;
      this.parentSignal.set(val);
    });

    effect(() => {
      const val = this.parentSignal();
      this.parentValue = val;
    });
  }
}