interface CardProps {
  title: string;
  description: string;
}

export function Card(props: CardProps) {
  return (
    <article className='flex flex-col gap-1 p-3 rounded-lg bg-white shadow space-y-4'>
      <h1 className='text-xl font-bold'>{props.title}</h1>
      <p>{props.description}</p>
      <button className='px-6 py-3 text-sm bg-[#032958] text-white rounded-xl'>
        Ver detalhes
      </button>
    </article>
  );
}
