import { useEffect, useRef, useState } from "react";
import SelectedSuggestions from "./selected-suggestions";

const MultiSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [isAutoSuggestOn, setAutoSuggestOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [focusedIndex, setFocusedIndex] = useState(0);
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
    setIsLoading(true);
    fetch(`https://dummyjson.com/users/search?q=${inputValue}`)
      .then((res) => res.json())
      .then((res) => {
        let suggestions = [...res.users];
        suggestions = suggestions.filter(
          (suggestion) => !selectedUsers.has(suggestion.email)
        );
        setAutoSuggestions(suggestions);
        setIsLoading(false);
      });
  };
  const handleKeyDown = (event) => {
    const { key } = event;
    if (key == "Backspace") {
      const tempSelectedSuggestions = [...selectedSuggestions];
      if (!inputValue.length && tempSelectedSuggestions.length > 0) {
        const oSuggestion =
          tempSelectedSuggestions[tempSelectedSuggestions.length - 1];
        removeItem(oSuggestion.id, oSuggestion.email);
      }
    }
  };
  const handleSuggestionsKeyDown = (event) => {
    const { key } = event;
    console.log(key);
    switch (key) {
      case "ArrowUp":
        if (autoSuggestions.length)
          setFocusedIndex((prevIndex) =>
            prevIndex == 0 ? autoSuggestions.length - 1 : prevIndex - 1
          );
        break;
      case "ArrowDown":
        if (autoSuggestions.length)
          setFocusedIndex((prevIndex) =>
            prevIndex == autoSuggestions.length - 1 ? 0 : prevIndex + 1
          );
        break;
      case "Enter":
        if (autoSuggestions.length)
          handleSuggestionClick(autoSuggestions[focusedIndex]);
        break;
    }
  };
  useEffect(() => {
    setFocusedIndex(0);
    if (isAutoSuggestOn && inputValue.length > 0) {
      fetchSuggestions();
    } else {
      setAutoSuggestOn(true);
      setAutoSuggestions([]);
    }
  }, [inputValue.length]);
  useEffect(() => {
    const parentRect = document
      .querySelector(".auto-suggestions-container")
      .getBoundingClientRect();
    const elem = document.querySelector(`.option-${focusedIndex}`);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      if (rect.top < parentRect.top || rect.bottom > parentRect.bottom)
        elem.scrollIntoView();
    }
  }, [focusedIndex]);
  return (
    <div className="main-container" onKeyDown={handleSuggestionsKeyDown}>
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
      {isLoading ? (
        <div className="auto-suggestions-container">
          <div className="auto-suggestions-item">Loading...</div>
        </div>
      ) : (
        <div className="auto-suggestions-container">
          {autoSuggestions.map((suggestion, idx) => (
            <div
              key={suggestion.id}
              className={`auto-suggestions-item option-${idx} ${
                focusedIndex == idx ? "selected-item" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <img src={suggestion.image} alt={suggestion.firstName} />{" "}
              {suggestion.firstName} {suggestion.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSearch;
