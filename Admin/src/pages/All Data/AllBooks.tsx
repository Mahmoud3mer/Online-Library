import React, { useState } from 'react'
import BooksTable from '../../components/BooksTable';
import AutoCompleteSearch from '../../components/AutoCompeleteSearch';
import { BookInterface } from '../../interfaces/BookInterface';
import Actions from '../../components/Actions';


const AllBooks = () => {

    const [searchResults, setSearchResults] = useState<BookInterface[]>([]); // State to hold the results from the search
    const handleSearchResults = (results: BookInterface[]) => {
        setSearchResults(results); // Update the parent state with the results from AutoCompleteSearch
    };
    const handleSelectItem = (selectedItem: BookInterface) => {
        console.log('Selected item from AutoComplete:', selectedItem);
    };

    const token = localStorage.getItem('token') || '';


    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    All Books
                </h4>
            </div>
            <div className='px-10 py-3'>

                <AutoCompleteSearch<BookInterface>
                    UrlWantToFetch="books"
                    inputName="book"
                    inputPlaceholder="Search for an Book..."
                    searchQuery='title'
                    inputOnSelect={handleSelectItem}
                    extractDisplayName={(book: any) => book.title}
                    updateSearchResults={handleSearchResults} // New prop to pass search results to the parent
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-3">
                {searchResults && searchResults.map((book, index) => (
                    <div className={index % 2 === 0 ? "bg-white dark:bg-form-input" : "bg-[#f9f9f9] dark:bg-strokedark"} key={book._id}>
                        <div className="img-container h-28">
                            <img src={book.coverImage} alt={book.title} className='h-full mx-auto' />
                        </div>
                        <div className="book-content p-2">
                            <h6 className='truncate overflow-hidden py-.5 text-sm'>{book.category ? book.category.name : 'Not Inserted'}</h6>
                            <h3 className='truncate overflow-hidden py-.5 text-lg'>{book.title}</h3>
                            <h6 className='truncate overflow-hidden py-.5 text-sm'>{book.author ? book.author.name : 'Not Inserted'}</h6>

                        </div>
                        <div className='mx-auto w-fit py-2'>
                            <Actions
                                itemId={book._id}
                                apiNeedToFetch="books"
                                navigateUrl="book-form"
                                token={token}
                                onUpdate={() => handleSearchResults}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-6 border-t  mt-5 border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Book Name</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Author</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Category</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Price</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Stock</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Actions</p>
                </div>
            </div>

            <BooksTable />


        </div>
    )
}

export default AllBooks