import { TestBed } from '@angular/core/testing';
import { SPokemon } from './pokemon';

describe('SPokemon', () => {
  let service: SPokemon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SPokemon);
  });

  it('should prefer animated sprites when the API provides them', () => {
    const pokemonData = {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 6,
      stats: [],
      abilities: [],
      sprites: {
        front_default: 'https://example.com/front.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/artwork.png'
          }
        },
        versions: {
          'generation-v': {
            'black-white': {
              animated: {
                front_default: 'https://example.com/pikachu.gif'
              }
            }
          }
        }
      }
    };

    const result = (service as any).processPokemon(pokemonData);

    expect(result.sprite).toBe('https://example.com/pikachu.gif');
  });
});
