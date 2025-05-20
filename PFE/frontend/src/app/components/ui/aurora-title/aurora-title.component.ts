import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aurora-title',
  imports: [],
  templateUrl: './aurora-title.component.html',
  styleUrl: './aurora-title.component.css'
})
export class AuroraTitleComponent {
@Input() title:string = ''
@Input() subtitle:string = ''

}
