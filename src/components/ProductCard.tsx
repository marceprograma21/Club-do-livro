import Image from 'next/image';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  quantity?: number;
  isAvailable: boolean;
}

export function ProductCard({
  imageUrl,
  title,
  description,
  price,
  isAvailable,
}: ProductCardProps) {
  return (
    <div className='flex flex-col items-center gap-1 p-4 h-auto w-60 border border-zinc-400 hover:border-sky-800 rounded-lg transition-all'>
      <img src={imageUrl} alt={title} className='max-h-32' />
      <h2 className='font-bold text-lg text-sky-800'>{title}</h2>

      <div className='flex flex-col gap-2 w-full'>
        <span className='text-xs font-light'>{description}</span>
        <span
          className={`${isAvailable ? 'visible' : 'opacity-0 select-none'} font-extrabold`}
        >
          R$ {price}
        </span>
        <button
          disabled={!isAvailable}
          className={`text-sm mt-2 ${isAvailable ? 'bg-sky-700 hover:bg-sky-800 cursor-pointer' : 'bg-zinc-400 cursor-not-allowed'} px-1 py-2 text-white rounded-md transition-all`}
        >
          {isAvailable ? 'Comprar' : 'Indisponível'}
        </button>
      </div>
    </div>
  );
}
