import { useEffect, useRef, useState } from "react";
import SelectedSuggestions from "./selected-suggestions";

const MultiSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [isAutoSuggestOn, setAutoSuggestOn] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const elementRef = useRef();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSuggestionClick = (oSuggestion) => {
    setAutoSuggestOn(false);
    setSelectedSuggestions([...selectedSuggestions, oSuggestion]);
    setSelectedUsers(new Set([...selectedUsers, oSuggestion.email]));
    setInputValue("");
    elementRef.current.focus();
  };
  const removeItem = (userId, userEmail) => {
    const tempUsers = new Set([...selectedUsers]);
    tempUsers.delete(userEmail);
    setSelectedUsers(new Set([...tempUsers]));
    let tempSuggestions = [...selectedSuggestions];
    tempSuggestions = tempSuggestions.filter(
      (suggestion) => suggestion.id != userId
    );
    setSelectedSuggestions(tempSuggestions);
  };
  const fetchSuggestions = () => {
    fetch(`https://dummyjson.com/users/search?q=${inputValue}`)
      .then((res) => res.json())
      .then((res) => {
        let suggestions = [...res.users];
        suggestions = suggestions.filter(suggestion => !selectedUsers.has(suggestion.email));
        setAutoSuggestions(suggestions);
      });
  };
  const handleKeyDown = (event) => {
    const { key } = event;
    if (key == "Backspace") {
      const tempSelectedSuggestions = [...selectedSuggestions];
      if (tempSelectedSuggestions.length > 0) {
        const oSuggestion =
          tempSelectedSuggestions[tempSelectedSuggestions.length - 1];
        removeItem(oSuggestion.id, oSuggestion.email);
      }
    }
  };
  useEffect(() => {
    if (isAutoSuggestOn && inputValue.length > 0) {
      fetchSuggestions();
    } else {
      setAutoSuggestOn(true);
      setAutoSuggestions([]);
    }
  }, [inputValue.length]);
  return (
    <div className="main-container">
      <div className="multi-search-container">
        <SelectedSuggestions
          selectedSuggestions={selectedSuggestions}
          handleRemoveItem={removeItem}
        />
        <input
          type="text"
          placeholder="Enter user name to search"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={elementRef}
        />
      </div>
      {autoSuggestions.length ? (
        <div className="auto-suggestions-container">
          {autoSuggestions.map((suggestion, idx) => (
            <div
              key={suggestion.id}
              className={`auto-suggestions-item`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <img src={suggestion.image} alt={suggestion.firstName} />{" "}
              {suggestion.firstName} {suggestion.lastName}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MultiSearch;
