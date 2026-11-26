
export function dataRelativa(dias: number) {
  const data = new Date();
  data.setDate(data.getDate() + dias);

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Días de atraso (positivo = atrasado, 0 = vence hoy, negativo = en plazo)
export function calcularAtraso(data: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const prazo = new Date(`${data}T00:00:00`);
  const diferenca = hoje.getTime() - prazo.getTime();

  return Math.floor(diferenca / (1000 * 60 * 60 * 24));
}