interface ButtonProps {
  text: string;
}

export function Button({ text }: ButtonProps) {
  return (
    <button
      type='submit'
      className='px-6 py-3 w-full font-light text-xs bg-[#0375E6] text-white rounded-full cursor-pointer hover:bg-[#0367ca] transition-colors'
    >
      {text}
    </button>
  );
}
