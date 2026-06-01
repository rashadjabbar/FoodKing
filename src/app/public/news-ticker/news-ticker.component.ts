import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-news-ticker',
  templateUrl: './news-ticker.component.html',
  styleUrls: ['./news-ticker.component.scss']
})
export class NewsTickerComponent implements AfterViewInit {
  @ViewChild('tickerTrack') tickerTrack!: ElementRef<HTMLElement>;

  newsList: NewsTickerItem[] = [];

  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private currentTranslateX = 0;
  private singleContentWidth = 0;
  private isDragging = false;
  private hasDragged = false;
  private isHovered = false;
  private pressedNewsLink: string | null = null;
  private dragStartX = 0;
  private dragStartTranslateX = 0;
  private speed = 150;

  constructor(private newsService: NewsService) {}

  ngAfterViewInit() {
    this.getNews();
  }

  ngOnDestroy() {
    this.stopAnimation();
  }

  getNews() {
    this.newsService.getNews().subscribe(res => {
      this.newsList = (res.data || [])
        .map((item: any) => this.mapNewsItem(item))
        .filter((item: NewsTickerItem | null): item is NewsTickerItem => !!item);

      setTimeout(() => {
        this.setupTicker();
      }, 0);
    });
  }

  setupTicker() {
    const el = this.tickerTrack.nativeElement as HTMLElement;
    const content = el.querySelector('.ticker-content') as HTMLElement;

    if (!content) return;

    this.speed = this.getTickerSpeed();
    this.singleContentWidth = content.scrollWidth / 2;

    if (!this.singleContentWidth) return;

    this.currentTranslateX = 0;
    this.applyTransform();
    this.startAnimation();
  }

  startAnimation() {
    this.stopAnimation();
    this.lastTimestamp = 0;
    this.animationFrameId = window.requestAnimationFrame(timestamp =>
      this.animateTicker(timestamp)
    );
  }

  stopAnimation() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animateTicker(timestamp: number) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    const deltaSeconds = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    if (!this.isDragging && !this.isHovered) {
      this.currentTranslateX -= this.speed * deltaSeconds;
      this.normalizeTranslate();
      this.applyTransform();
    }

    this.animationFrameId = window.requestAnimationFrame(nextTimestamp =>
      this.animateTicker(nextTimestamp)
    );
  }

  onPointerDown(event: PointerEvent) {
    if (!this.singleContentWidth) return;

    this.isDragging = true;
    this.hasDragged = false;
    this.pressedNewsLink = this.getNewsLinkFromEventTarget(event.target);
    this.dragStartX = event.clientX;
    this.dragStartTranslateX = this.currentTranslateX;
    this.tickerTrack.nativeElement.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.dragStartX;
    this.hasDragged = this.hasDragged || Math.abs(deltaX) > 5;

    if (this.hasDragged) {
      event.preventDefault();
    }

    this.currentTranslateX = this.dragStartTranslateX + deltaX;
    this.normalizeTranslate();
    this.applyTransform();
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;

    const shouldOpenLink = !this.hasDragged && !!this.pressedNewsLink;

    this.isDragging = false;
    this.lastTimestamp = 0;
    this.tickerTrack.nativeElement.releasePointerCapture(event.pointerId);
    const linkToOpen = this.pressedNewsLink;
    this.hasDragged = false;
    this.pressedNewsLink = null;

    if (shouldOpenLink && linkToOpen) {
      window.open(linkToOpen, '_blank', 'noopener,noreferrer');
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
    this.lastTimestamp = 0;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.newsList.length) return;

    setTimeout(() => {
      this.setupTicker();
    }, 0);
  }

  private normalizeTranslate() {
    if (!this.singleContentWidth) return;

    while (this.currentTranslateX <= -this.singleContentWidth) {
      this.currentTranslateX += this.singleContentWidth;
    }

    while (this.currentTranslateX > 0) {
      this.currentTranslateX -= this.singleContentWidth;
    }
  }

  private applyTransform() {
    const content = this.tickerTrack?.nativeElement.querySelector(
      '.ticker-content'
    ) as HTMLElement | null;

    if (!content) return;

    content.style.transform = `translate3d(${this.currentTranslateX}px, 0, 0)`;
  }

  private getNewsLinkFromEventTarget(target: EventTarget | null) {
    const node = target as Node | null;
    const element =
      node instanceof HTMLElement
        ? node
        : (node?.parentElement as HTMLElement | null);
    const linkElement = element?.closest('.ticker-link') as HTMLElement | null;
    const link = linkElement?.dataset['link'];

    return link || null;
  }

  private mapNewsItem(item: any): NewsTickerItem | null {
    if (item == null) {
      return null;
    }

    if (typeof item === 'string') {
      const trimmedText = item.trim();
      return trimmedText ? { text: trimmedText, link: null } : null;
    }

    const text =
      item.title ??
      item.text ??
      item.news ??
      item.name ??
      item.description ??
      item.content;

    if (typeof text !== 'string' || !text.trim()) {
      return null;
    }

    const link =
      item.link ??
      item.url ??
      item.newsLink ??
      item.href ??
      item.redirectUrl ??
      null;

    return {
      text: text.trim(),
      link:
        typeof link === 'string' && link.trim()
          ? link.trim()
          : null
    };
  }

  private getTickerSpeed() {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 576) {
      return 90;
    }

    if (viewportWidth <= 768) {
      return 100;
    }

    if (viewportWidth <= 992) {
      return 110;
    }

    return 150;
  }
}

interface NewsTickerItem {
  text: string;
  link: string | null;
}
