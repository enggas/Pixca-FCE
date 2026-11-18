import { Link } from 'react-router-dom'

const InfoPage = ({ titulo, children }) => (
  <article className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
    <Link to="/transportista" className="text-sm font-semibold text-[#3d7289] hover:underline">
      ← Volver al panel
    </Link>
    <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-4">{titulo}</h1>
    <div className="space-y-3 text-slate-700">{children}</div>
  </article>
)

export const PrimerTrasladoPage = () => (
  <InfoPage titulo="¿Cómo hacer mi primer traslado?">
    <p>Aquí se describirá el proceso paso a paso para realizar tu primer traslado.</p>
    <p>Contenido pendiente.</p>
  </InfoPage>
)

export const FuncionamientoPage = () => (
  <InfoPage titulo="Funcionamiento general">
    <p>Aquí se describirá el funcionamiento general de la plataforma para transportistas.</p>
    <p>Contenido pendiente.</p>
  </InfoPage>
)