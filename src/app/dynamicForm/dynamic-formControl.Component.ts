import { Component, signal, computed, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form-control',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'form-group' },
  template: `
    <label class="form-label">{{ label() }}</label>
    <input 
      type="text" 
      class="form-control"
      [ngClass]="{'is-invalid': hasError()}"
      [value]="value()"
      (input)="updateValue($event)"
      (blur)="touched.set(true)"
    />
    
    @if (touched() && !value()) {
      <div class="invalid-feedback">This field is required</div>
    }

    <button 
      class="btn btn-primary mt-2" 
      (click)="onSubmit.emit(value())"
      [disabled]="!value()"
    >
      Submit
    </button>

    <pre>Current value: {{ value() }}</pre>
  `,
  styles: [`
    .form-group { margin-bottom: 1.5rem; max-width: 400px; }
    .form-control.is-invalid { border-color: #dc3545; }
  `]
})
export class DynamicFormControlComponent {
  // ── Now a real signal input ──
  label = input<string>('Enter value');   // default value optional

  // For two-way binding (as fixed previously)
  value = input<string>('');                      // if using input() style
  // OR better: use model() for true two-way (recommended in v17+ / v20)
  // value = model<string>('');                   // ← cleaner alternative

  @Output() valueChange = new EventEmitter<string>();  // only needed if NOT using model()

  updateValue(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(newValue);   // emit upward for two-way
  }

  touched = signal<boolean>(false);
  hasError = computed(() => this.touched() && !this.value());

  @Output() onSubmit = new EventEmitter<string>();
}