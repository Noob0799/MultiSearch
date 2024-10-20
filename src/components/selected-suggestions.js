const SelectedSuggestions = ({ selectedSuggestions, handleRemoveItem }) => {
  return (
    <>
      {selectedSuggestions.map((suggestion) => (
        <div className="multi-search-item" key={suggestion.id} onClick={() => handleRemoveItem(suggestion.id, suggestion.email)}>
          {suggestion.firstName} {suggestion.lastName} <span>&times;</span>
        </div>
      ))}
    </>
  );
};

export default SelectedSuggestions;
