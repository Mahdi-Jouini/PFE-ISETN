import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HoverBorderEffectComponent } from "../hover-border-effect/hover-border-effect.component";
import { IssueIconComponent } from "../../issue-components/issue-icon/issue-icon.component";

@Component({
  selector: 'app-select-input',
  imports: [CommonModule, HoverBorderEffectComponent, IssueIconComponent],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css'
})
export class SelectInputComponent implements OnInit {
  @Input() currentState: string = '';
  @Input() IssueTypeSelect: boolean = false;
  @Input() states: string[] = [];
  @Output() stateChanged = new EventEmitter<string>();

  isOpen: boolean = false;

  ngOnInit(): void {
    if (!this.currentState && this.states.length > 0) {
      this.currentState = this.states[0];
    }
    
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.state-dropdown')) {
        this.isOpen = false;
      }
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectState(state: string): void {
    this.currentState = state;
    this.stateChanged.emit(state);
    this.isOpen = false;
  }
}
