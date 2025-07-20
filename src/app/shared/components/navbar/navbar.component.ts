import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() currentRoute: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = '/';
  @Input() backLabel: string = 'Retour à l\'accueil';

  isLoggedIn = false; // This would come from an auth service
  username = 'Marie D.'; // This would come from an auth service

  logout(): void {
    // This would call an auth service
    this.isLoggedIn = false;
    console.log('Logout functionality would be implemented here');
  }
}
