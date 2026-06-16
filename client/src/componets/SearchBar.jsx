function SearchBar({ search, setSearch, onSearch }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-6">
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border rounded-lg md:rounded-xl px-4 py-2 md:py-3 text-sm md:text-base"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;