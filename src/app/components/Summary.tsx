import { FinanceEntry } from "../types/Entry";

type Props = {
  entries: FinanceEntry[];
};

export function Summary({ entries }: Props) {
  const totalReceitas = entries
    .filter(entry => entry.type === "receita")
    .reduce((acc, entry) => acc + entry.value, 0);

  const totalDespesas = entries
    .filter(entry => entry.type !== "receita")
    .reduce((acc, entry) => acc + entry.value, 0);

  const saldo = totalReceitas - totalDespesas;

  const saldoColor =
    saldo > 0
      ? "bg-green-100 text-green-800"
      : saldo < 0
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="w-full flex flex-wrap justify-between gap-3 mb-6">
      <div className="flex-1 min-w-[120px] max-w-[320px] p-3 rounded-md shadow-sm bg-green-100 text-green-800">
        <h3 className="text-xs font-semibold text-gray-600">Receitas</h3>
        <p className="text-xl font-bold">
          {totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className="flex-1 min-w-[120px] max-w-[320px] p-3 rounded-md shadow-sm bg-red-100 text-red-800">
        <h3 className="text-xs font-semibold text-gray-600">Despesas</h3>
        <p className="text-xl font-bold">
          {totalDespesas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className={`flex-1 min-w-[120px] max-w-[320px] p-3 rounded-md shadow-sm ${saldoColor}`}>
        <h3 className="text-xs font-semibold text-gray-600">Saldo</h3>
        <p className="text-xl font-bold">
          {saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    </div>
  );
}
