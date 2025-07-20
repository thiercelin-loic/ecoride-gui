import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'José Martinez',
      role: 'Directeur Technique',
      description: 'Passionné de technologie et d\'environnement, José pilote le développement de la plateforme EcoRide.',
      image: 'JM'
    },
    {
      name: 'Marie Dubois',
      role: 'Directrice Marketing',
      description: 'Experte en communication environnementale, Marie développe la stratégie de croissance durable d\'EcoRide.',
      image: 'MD'
    },
    {
      name: 'Pierre Lefebvre',
      role: 'Responsable Opérations',
      description: 'Spécialiste en logistique et transport, Pierre optimise l\'expérience utilisateur au quotidien.',
      image: 'PL'
    }
  ];

  milestones = [
    {
      year: '2024',
      title: 'Lancement d\'EcoRide',
      description: 'Création de la startup avec pour mission de révolutionner le covoiturage écologique en France.'
    },
    {
      year: '2024',
      title: 'Développement de la plateforme',
      description: 'Mise en place de la technologie et des premiers partenariats avec des conducteurs éco-responsables.'
    },
    {
      year: '2025',
      title: 'Expansion nationale',
      description: 'Objectif de couverture de 50 villes françaises et 10 000 utilisateurs actifs.'
    },
    {
      year: '2026',
      title: 'Innovation verte',
      description: 'Intégration de nouvelles technologies pour optimiser les trajets et réduire encore plus l\'impact carbone.'
    }
  ];

  stats = [
    { value: '2024', label: 'Année de création' },
    { value: '100%', label: 'Engagement écologique' },
    { value: '50+', label: 'Villes desservies' },
    { value: '24/7', label: 'Support utilisateur' }
  ];
}
