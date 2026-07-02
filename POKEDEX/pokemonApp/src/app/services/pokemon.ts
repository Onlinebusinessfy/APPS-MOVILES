import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { IPokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class SPokemon {

  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl = `${this.URL_BASE}?limit=20&offset=0`;

  constructor() { }

  async getPokemons(): Promise<IPokemon[]> {

    try {

      const response = await fetch(this.nextUrl);
      const data = await response.json();

      console.log("FETCH OK:", data);

      if (!data || !data.results) {
        return [];
      }

      const pokemons: IPokemon[] = [];
      const result: any[] = data.results;
      this.nextUrl = data.next;

      console.log("RESPUESTA API:", response);

      const promises = result.map((p: any) =>
        CapacitorHttp.get({ url: p.url })
      );

      const responses = await Promise.all(promises);

      for (const res of responses) {
        pokemons.push(this.processPokemon(res.data));
      }

      console.log("POKEMONS FINAL:", pokemons);

      return pokemons;

    } catch (error) {
      console.error("ERROR getPokemons:", error);
      return [];
    }
  }

  private processPokemon(pokemonData: any): IPokemon {
    const animatedSprite = pokemonData.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
    const officialArtwork = pokemonData.sprites?.other?.['official-artwork']?.front_default;
    const defaultSprite = pokemonData.sprites?.front_default;

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types?.[0]?.type?.name,
      type2: pokemonData.types?.[1]?.type?.name,
      sprite: animatedSprite || officialArtwork || defaultSprite || 'assets/icon/pokeball.png',
      height: (pokemonData.height / 10).toString(),
      weight: (pokemonData.weight / 10).toString(),
      stats: pokemonData.stats?.map((stat: any) => ({
        base_stat: stat.base_stat,
        name: stat.stat.name
      })) || [],
      abilities: pokemonData.abilities
        ?.filter((a: any) => !a.is_hidden)
        ?.map((a: any) => a.ability.name) || [],
    };
  }

  async getPokemonById(id: number | string) {
    return CapacitorHttp.get({
      url: `${this.URL_BASE}/${id}`
    });
  }
}