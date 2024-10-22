import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import React from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs'

const SearchBar = () => {
  const [{contactSearch}, dispatch] = useStateProvider()
  return (
    <div className="xs:pl-1 xs:pr-1 flex items-center bg-search-input-container-background py-3 pl-5">
      <div className="xs:gap-1 xs:py-1 xs:px-3 bg-panel-header-background flex justify-center items-center gap-5 px-3 py-3 rounded-lg flex-grow w-full">
        <div>
          <BiSearchAlt2 className="xs:text-sm text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div className='w-full h-full'>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="xs:text-[8px] bg-transparent text-sm focus:outline-none text-white w-full"
            value={contactSearch}
            onChange={(e) => dispatch({
              type: reducerCases.SET_CONTACT_SEARCH, contactSearch: e.target.value, 
            })}
          />
        </div>
      </div>
      <div className='xs:hidden pr-5 pl-3'>
        <BsFilter className='text-panel-header-icon cursor-pointer text-lg' />
      </div>
    </div>
  );
};

export default SearchBar;
