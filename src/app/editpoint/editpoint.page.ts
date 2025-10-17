import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import { NavController } from '@ionic/angular';
import { materialIcon } from '../material-icon';

@Component({
  selector: 'app-editpoint',
  templateUrl: './editpoint.page.html',
  styleUrls: ['./editpoint.page.scss'],
  standalone: false,
})
export class EditpointPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private router = inject(Router);
  private navCtrl = inject(NavController);

  point: any = {};
  map!: L.Map;
  marker!: L.Marker;
  pointKey: string = '';

  constructor() {}

  ngOnInit() {
    this.pointKey = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if (this.pointKey) {
      this.dataService.getPointByKey(this.pointKey).then(snapshot => {
        this.point = snapshot.val();
        this.initMap();
      });
    }
  }

  initMap() {
    const coordinates = this.point.coordinates.split(',');
    const lat = parseFloat(coordinates[0]);
    const lon = parseFloat(coordinates[1]);

    this.map = L.map('edit-map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], { draggable: true, icon: materialIcon }).addTo(this.map);

    this.marker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      this.point.coordinates = `${position.lat.toFixed(6)},${position.lng.toFixed(6)}`;
    });
  }

  updatePoint() {
    if (this.pointKey && this.point) {
      this.dataService.updatePoint(this.pointKey, this.point).then(() => {
        this.navCtrl.back();
      });
    }
  }
}
