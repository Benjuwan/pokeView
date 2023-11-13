import "./App.css";
import { PokeContents } from "./pokeComponents/PokeContents";

export const App = () => {
  return (
    <>
      <h1 style={{ 'textAlign': 'center', 'lineHeight': '2' }}><a href="https://pokeapi.co/" target="_blank">Pokémon API</a></h1>
      <PokeContents />
    </>
  );
}