export const nome = 'Maria';
export const idade = 50;

export const netos = ['José', 'Lucas'];

export default function apresentar() {
  return `Olá, meu nome é ${nome}, tenho ${idade} anos e tenho dois netos, o ${netos[0]} e o ${netos[1]}`;
}
