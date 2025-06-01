import { Component } from '@angular/core';

interface Link {
  label: string;
  route: string;
}

interface Section {
  title: string;
  links: Link[];
}
@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  sections: Section[] = [
    {
      title: 'Derechos',
      links: [
        { label: 'Legales', route: '/legales' },
        { label: 'Copyright', route: '/copyright' }
      ]
    },
    {
      title: 'Acerca de',
      links: [
        { label: 'Nosotros', route: '/nosotros' },
        { label: 'Productos', route: '/productos' },
        { label: 'Campañas', route: '/campanas' }
      ]
    },
    {
      title: 'Políticas',
      links: [
        { label: 'Cookies', route: '/cookies' },
        { label: 'Compras', route: '/compras' }
      ]
    }
  ];
}

