import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsLayout } from './tabs-layout';

describe('TabsLayout', () => {
  let component: TabsLayout;
  let fixture: ComponentFixture<TabsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
