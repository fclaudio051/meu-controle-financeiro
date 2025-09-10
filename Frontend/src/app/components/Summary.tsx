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

  const saldoGradient =
    saldo > 0
      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
      : saldo < 0
      ? "bg-gradient-to-br from-red-500 to-pink-600 text-white"
      : "bg-gradient-to-br from-gray-400 to-gray-500 text-white";

  return (
    <div className="w-full grid-responsive-summary mb-6 sm:mb-8">
      {/* Card de Receitas */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white card-responsive shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90">💰 Receitas</h3>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm sm:text-lg">📈</span>
          </div>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
          {totalReceitas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <div className="h-1 bg-white/20 rounded-full">
          <div className="h-full bg-white/40 rounded-full w-3/4"></div>
        </div>
      </div>

      {/* Card de Despesas */}
      <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white card-responsive shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90">💸 Despesas</h3>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm sm:text-lg">📉</span>
          </div>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
          {totalDespesas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <div className="h-1 bg-white/20 rounded-full">
          <div className="h-full bg-white/40 rounded-full w-2/3"></div>
        </div>
      </div>

      {/* Card de Saldo */}
      <div className={`card-responsive shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${saldoGradient} sm:col-span-2 lg:col-span-1`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90">
            {saldo >= 0 ? "🎯 Saldo Positivo" : "⚠️ Saldo Negativo"}
          </h3>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm sm:text-lg">{saldo >= 0 ? "✅" : "❌"}</span>
          </div>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
          {saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <div className="h-1 bg-white/20 rounded-full">
          <div className={`h-full bg-white/40 rounded-full ${saldo >= 0 ? "w-full" : "w-1/4"}`}></div>
        </div>
      </div>
    </div>
  );
}