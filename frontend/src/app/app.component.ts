import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsContainer } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastsContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
