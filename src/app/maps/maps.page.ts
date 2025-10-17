import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DataService } from '../data.service';
import { AlertController } from '@ionic/angular';
import { materialIcon } from '../material-icon';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage {
  private dataService = inject(DataService);
  private alertController = inject(AlertController);
  private router = inject(Router);

  map!: L.Map;
  private markers: L.Marker[] = [];

  constructor() { }

  ionViewDidEnter() {
    if (!this.map) {
      this.map = L.map('map').setView([-7.7956, 110.3695], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    }
    this.getAllPoints();
  }

  getAllPoints() {
    this.dataService.getPoints().then((data: any) => {
      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const point = data[key];
          if (point && point.coordinates) {
            const coordinates = point.coordinates.split(',');
            const lat = parseFloat(coordinates[0]).toFixed(4);
            const lon = parseFloat(coordinates[1]).toFixed(4);

            const popupContent = `
            <div class="professional-popup">
              <div class="popup-header">
                <b>${point.name}</b>
              </div>
              <div class="popup-body">
                <div class="coords">
                  <ion-icon name="location-outline"></ion-icon>
                  <span>${lat}, ${lon}</span>
                </div>
              </div>
              <div class="popup-footer">
                <button class="popup-edit-button" id="edit-${key}">
                  <ion-icon name="create-outline"></ion-icon> Edit
                </button>
                <button class="popup-delete-button" id="delete-${key}">
                  <ion-icon name="trash-outline"></ion-icon> Delete
                </button>
              </div>
            </div>
            `;

            const marker = L.marker([parseFloat(lat), parseFloat(lon)], { icon: materialIcon })
              .addTo(this.map)
              .bindPopup(popupContent, { className: 'professional-popup-container' });

            this.markers.push(marker);

            marker.on('popupopen', () => {
              document.getElementById(`edit-${key}`)?.addEventListener('click', () => {
                this.editPoint(key);
              });
              document.getElementById(`delete-${key}`)?.addEventListener('click', () => {
                this.presentDeleteConfirm(key, point.name);
              });
            });
          }
        }
      }
    });
  }

  editPoint(key: string) {
    this.router.navigate(['/tabs/editpoint', key]);
  }

  async presentDeleteConfirm(key: string, name: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: () => {
            this.deletePoint(key);
          }
        }
      ]
    });

    await alert.present();
  }

  deletePoint(key: string) {
    this.dataService.deletePoint(key).then(() => {
      this.map.closePopup();
      this.getAllPoints();
    });
  }
}