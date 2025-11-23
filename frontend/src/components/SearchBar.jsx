import { Input } from "@mantine/core";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [value, setValue] = useState("");

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(value.trim());
    }, 500);

    return () => clearTimeout(delay);
  }, [value]);

  const handleClear = () => {
    setValue("");
    onSearch(""); 
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      rightSection={
        value && (
          <IoClose
            size={18}
            className="text-gray-500 cursor-pointer"
            onClick={handleClear}
          />
        )
      }
      className="w-full sm:w-96"
    />
  );
};

export default SearchBar;
