import { Icon, TextField } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
// import {useState, useCallback} from 'react';

export default function SearchBar({ value, onChange }) {
  // const [value, setValue] = useState('');

  // const handleChange = useCallback(
  //   (newValue) => setValue(newValue),
  //   [],
  // );

  // console.log("search value:", value)

  return (
    <TextField
      label=""
      value={value}
      onChange={onChange}
      autoComplete="off"
      placeholder="Search for sections"
      prefix={<Icon source={SearchIcon} />}
    />
  );
}
