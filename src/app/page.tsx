import apresentar, { nome, idade, netos } from '../test/maria';

export default function HomePage() {
  return (
    <main className='flex flex-col items-center justify-center w-full min-h-screen'>
      <p>Nome: {nome}</p>
      <p>Idade: {idade}</p>
      <p>Netos: {netos}</p>
      <p>{apresentar()}</p>
    </main>
  );
}
