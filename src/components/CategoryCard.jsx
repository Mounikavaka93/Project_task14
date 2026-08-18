export default function CategoryCard({ category, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-[96px] shrink-0 flex-col items-center gap-2 rounded-2xl border p-2.5 text-center transition duration-200 sm:w-[120px] sm:p-3 ${
        active
          ? 'border-brand bg-brand-soft shadow-sm'
          : 'border-line bg-card hover:border-brand/40 hover:shadow-sm'
      }`}
    >
      <span className="h-16 w-16 overflow-hidden rounded-xl sm:h-[72px] sm:w-[72px]">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </span>
      <span
        className={`text-sm font-semibold ${active ? 'text-brand' : 'text-ink'}`}
      >
        {category.name}
      </span>
    </button>
  )
}
