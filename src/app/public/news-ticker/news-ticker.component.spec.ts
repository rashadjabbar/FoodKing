import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTickerComponent } from './news-ticker.component';

describe('NewsTickerComponent', () => {
  let component: NewsTickerComponent;
  let fixture: ComponentFixture<NewsTickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsTickerComponent]
    });
    fixture = TestBed.createComponent(NewsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
