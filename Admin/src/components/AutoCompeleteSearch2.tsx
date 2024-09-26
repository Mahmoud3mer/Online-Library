import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { apiUrl } from '../utils/apiUrl';

interface AutoCompleteSearchProps<T> {
  UrlWantToFetch: string;
  inputName: string;
  inputPlaceholder: string;
  searchQuery: string; // The query parameter to search for
  inputOnSelect: (selectedItem: T) => void;
  extractDisplayName: (item: T) => string; // Function to extract the display name for auto-complete
}

const AutoCompleteSearch2 = <T,>({
  UrlWantToFetch,
  inputName,
  inputPlaceholder,
  searchQuery,
  inputOnSelect,
  extractDisplayName,
}: AutoCompleteSearchProps<T>) => {
  const [dataResults, setDataResults] = useState<T[]>([]);
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [query, setQuery] = useState(''); // Input field value
  const [searchQueryValue, setSearchQueryValue] = useState(''); // The value that will be used in the API call

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const res = await axios.get(`${apiUrl}/${UrlWantToFetch}?limit=20&${searchQuery}=${searchQueryValue}`);
        setDataResults(res.data.data); // Set data from the API
        console.log(res.data.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (searchQueryValue.trim()) { // Only fetch if searchQueryValue is not empty
      fetchData();
    }
  }, [UrlWantToFetch, searchQuery, searchQueryValue]); // Trigger when URL, query parameter, or search query changes

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setQuery(inputValue); // Update input field value
    setSearchQueryValue(inputValue); // Update value for API search

    if (inputValue) {
      setSearchResults(
        dataResults.filter((item) =>
          extractDisplayName(item).toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  };

  const handleSelect = (item: T) => {
    setQuery(extractDisplayName(item)); // Set selected item in input field
    setSearchResults([]); // Clear the dropdown
    inputOnSelect(item); // Pass the selected item to the parent component
  };

  return (
    <div className="relative">
      <input
        name={inputName}
        value={query}
        onChange={handleQueryChange} // Call when user types in the input
        type="search"
        placeholder={inputPlaceholder}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
      />
      {searchResults.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg border rounded-md dark:bg-black">
          {searchResults.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="cursor-pointer p-2 hover:bg-meta-4 hover:text-white"
            >
              {extractDisplayName(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteSearch2;
