import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { GET_ALL_CONTACTS } from '@/utils/ApiRoutes';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi';
import ChatListItem from './ChatListItem';

const ContactsList = () => {
  const [allContacts, setAllContacts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchContacts, setSearchContacts] = useState({});
  const [{}, dispatch] = useStateProvider();

  // When search terms are changed
  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm, allContacts]);

  // When component is added get all contacts from API with useEffect
  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data } = await axios.get(GET_ALL_CONTACTS);
        if (data && data.usersGroupedByInitialLetter) {
          setAllContacts(data.usersGroupedByInitialLetter);
          setSearchContacts(data.usersGroupedByInitialLetter);
        } else {
          console.log('Unexpected data structure', data);
          setAllContacts({});
        }
      } catch (error) {
        console.log('Failed to get contacts', error.message);
        setAllContacts({});
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-20 flex px-3 py-8 border-r-[1px] border-x-conversation-border">
        <div className="flex flex-row justify-between items-center text-white w-full">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() =>
              dispatch({
                type: reducerCases.SET_ALL_CONTACTS_PAGE,
              })
            }
          />
          <span className='text-[13px]' >New Chat</span>
        </div>
      </div>

      <div
        className="bg-search-input-container-background h-full flex flex-col overflow-auto custom-scrollbar py-3"
      >
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="xs:gap-1 bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="xs:text-sm text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Search contacts"
                className="xs:text-[8px] bg-transparent text-sm focus:outline-none text-white w-full align-middle py-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {Object.keys(searchContacts).length > 0? (
          Object.entries(searchContacts).map(([initialLetter, userList]) => {
            if (userList.length > 0) {
              return (
                <div className='px-3' key={initialLetter}>
                  <div className="xs:pl-3 text-teal-light pl-10 py-5">{initialLetter}</div>
                  {userList.map((contact) => (
                    <ChatListItem
                      key={contact.id}
                      data={contact}
                      isContactsPage={true}
                    />
                  ))}
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="text-white text-center pt-5">No contacts found</div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;