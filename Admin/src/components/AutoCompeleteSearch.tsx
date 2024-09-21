import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { apiUrl } from '../utils/apiUrl';

interface AutoCompleteSearchProps<T> {
    UrlWantToFetch: string;
    inputName: string;
    inputPlaceholder: string;
    inputOnSelect: (selectedItem: T) => void;
    extractDisplayName: (item: T) => string; // Function to extract the display name for auto-complete
}

const AutoCompleteSearch = <T,>({
    UrlWantToFetch,
    inputName,
    inputPlaceholder,
    inputOnSelect,
    extractDisplayName
}: AutoCompleteSearchProps<T>) => {
    const [dataResults, setDataResults] = useState<T[]>([]);
    const [searchResults, setSearchResults] = useState<T[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/${UrlWantToFetch}?${searched}=${searchedValue}`);
                setDataResults(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [UrlWantToFetch]);
    // console.log(searchResults);
    
    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        if (inputValue) {
            setSearchResults(
                dataResults.filter(item =>
                    extractDisplayName(item).toLowerCase().includes(inputValue.toLowerCase())
                )
            );
        } else {
            setSearchResults([]);
        }
    };

    const handleSelect = (item: T) => {
        setQuery(extractDisplayName(item));
        setSearchResults([]);
        inputOnSelect(item); // Pass the selected item back to the parent component
    };

    return (
        <div className="relative">
            <input
                name={inputName}
                value={query}
                onChange={handleQueryChange}
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

export default AutoCompleteSearch;
