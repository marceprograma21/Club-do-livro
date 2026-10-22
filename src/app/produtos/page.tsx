import { ProductCard } from '@/src/components/ProductCard';
import { PRODUCTS } from '@/src/utils/products';

export default function ProductsPage() {
  const total = PRODUCTS.length;
  const available = PRODUCTS.filter((product) => product.isAvailable).length;

  return (
    <main className='relative min-h-screen bg-[#f6efe4]'>
      {/* Textura de papel */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60'
        style={{
          backgroundImage:
            'radial-gradient(rgba(43,29,20,.10) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent)',
        }}
      />

      <div className='relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-20'>
        {/* Encabezado */}
        <header className='flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between'>
          <div className='max-w-xl'>
            <p className='text-xs font-medium uppercase tracking-[0.25em] text-[#8c2f39]'>
              Produtos
            </p>
            <h1 className='mt-3 font-serif text-4xl leading-tight tracking-tight text-[#2b1d14] sm:text-5xl'>
              Nossa <span className='italic text-[#1f3d2e]'>estante</span>
            </h1>
            <p className='mt-3 text-base text-[#6b5a4c]'>
              Livros e itens escolhidos com carinho para quem ama ler. Encontre
              a sua próxima história.
            </p>
          </div>

          <dl className='flex gap-3'>
            <div className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] px-5 py-3 text-center'>
              <dd className='font-serif text-2xl font-semibold tabular-nums text-[#2b1d14]'>
                {total}
              </dd>
              <dt className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                Títulos
              </dt>
            </div>
            <div className='rounded-2xl border border-[#d9c9a8] bg-[#fffaf1] px-5 py-3 text-center'>
              <dd className='font-serif text-2xl font-semibold tabular-nums text-[#2f5d46]'>
                {available}
              </dd>
              <dt className='text-[11px] uppercase tracking-wider text-[#6b5a4c]'>
                Disponíveis
              </dt>
            </div>
          </dl>
        </header>

        {/* Divisor */}
        <div className='my-10 flex items-center gap-3 text-[#a8967f]'>
          <span className='h-px flex-1 bg-[#d9c9a8]' />
          <svg viewBox='0 0 24 24' fill='none' className='h-4 w-4'>
            <path
              d='M12 6.5C10.3 5.2 8 4.8 4.5 5v12.5c3.5-.2 5.8.2 7.5 1.5m0-12.5c1.7-1.3 4-1.7 7.5-1.5V17.5c-3.5-.2-5.8.2-7.5 1.5m0-12.5V19'
              stroke='currentColor'
              strokeWidth='1.7'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span className='h-px flex-1 bg-[#d9c9a8]' />
        </div>

        {/* Grid */}
        {total === 0 ? (
          <div className='rounded-3xl border border-dashed border-[#d9c9a8] bg-[#fffaf1] px-6 py-20 text-center'>
            <p className='font-serif text-2xl text-[#2b1d14]'>
              A estante está vazia por enquanto
            </p>
            <p className='mt-2 text-sm text-[#6b5a4c]'>
              Novos produtos chegam em breve. Volte logo!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                imageUrl={product.imageUrl}
                title={product.title}
                description={product.description}
                price={product.price}
                isAvailable={product.isAvailable}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}