export default function EventFilter({ search, setSearch, sortOrder, setSortOrder }) {
  return (
    <div className="event-filter">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events..."
      />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Sort by Date ↑</option>
        <option value="desc">Sort by Date ↓</option>
      </select>
    </div>
  );
}
