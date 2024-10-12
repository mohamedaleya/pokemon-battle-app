import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEditComponent } from './pokemon-edit.component';

describe('PokemonEditComponent', () => {
  let component: PokemonEditComponent;
  let fixture: ComponentFixture<PokemonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
