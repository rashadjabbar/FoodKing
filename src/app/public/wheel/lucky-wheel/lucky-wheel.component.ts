import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import { DataService } from "../../../../services/public/data.service";
const COLORS = ["#f82", "#0bf", "#fb0", "#0fb", "#b0f", "#f0b", "#bf0"];

@Component({
  selector: 'app-lucky-wheel',
  templateUrl: './lucky-wheel.component.html',
  styleUrls: ['./lucky-wheel.component.scss']
})
export class LuckyWheelComponent implements OnInit {


  ngOnInit() {
    // Initial rotation
    // Start engine
  }
  segments = [
    { label: 'Ucuz Priz 1', color: '#FFD700' },
    { label: 'Ucuz Priz 2', color: '#FFD700' },
    { label: 'Ucuz Priz 3', color: '#FFD700' },
    { label: 'Ucuz Priz 4', color: '#FFD700' },
    { label: 'Orta Priz 1', color: '#C0C0C0' },
    { label: 'Orta Priz 2', color: '#C0C0C0' },
    { label: 'Mega Priz', color: '#FF4500' }
  ];
  rotation = 0;
  prize: string | null = null;
  showPrize = false;

  spinWheel() {
    this.showPrize = false; // Prizi gizlət
    const rotations = Math.floor(Math.random() * 10) + 5;
    const randomAngle = Math.random() * 360;
    this.prize = this.calculatePrize(randomAngle);
    this.rotation = rotations * 360 + randomAngle;

    // 4 saniyə sonra prizi göstər
    setTimeout(() => {
      this.showPrize = true;
    }, 4000);
  }

  calculatePrize(angle: number) {
    const segmentAngle = 360 / this.segments.length;
    const segmentIndex = Math.floor((angle % 360) / segmentAngle);
    return this.segments[segmentIndex].label;
  }

}
