function SearchBar({ search, setSearch, onSearch }) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border rounded-xl px-4 py-3"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;