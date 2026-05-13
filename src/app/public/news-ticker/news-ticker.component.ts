import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-news-ticker',
  templateUrl: './news-ticker.component.html',
  styleUrls: ['./news-ticker.component.scss']
})
export class NewsTickerComponent implements AfterViewInit {
  constructor(private newsService: NewsService) {}

  @ViewChild('tickerTrack') tickerTrack!: ElementRef;
  newsList: any[] = [];

  ngAfterViewInit() {
    this.getNews();
  }

  getNews() {
    this.newsService.getNews().subscribe(res => {
      this.newsList = res.data;

      // ⚠️ Məlumat DOM-a düşdükdən sonra animasiyanı başlat
      setTimeout(() => {
        this.startAnimation();
      }, 0); // DOM render üçün 1 tick gecikmə
    });
  }

  startAnimation() {
    const el = this.tickerTrack.nativeElement as HTMLElement;
    const content = el.querySelector('.ticker-content') as HTMLElement;

    if (!content) return;

    const contentWidth = content.scrollWidth;
    const speed = 60; // px/s
    const duration = (contentWidth / speed) * 1000;

    content.animate(
      [
        { transform: `translateX(${window.innerWidth}px)` }, // sağdan ekran kənarından başla
        { transform: `translateX(-${contentWidth / 2}px)` }   // ortadakı contentin sonuna qədər sürüş
      ],
      {
        duration: duration,
        iterations: Infinity,
        easing: 'linear'
      }
    );
  }
}
