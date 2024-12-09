// Header.jsx
import { Button, Text } from "@shopify/polaris";
import style from "./header.module.css";

const Header = ({ handleCategoryClick }) => {
  return (
    <div className={style.header}>
      {["All Sections", "Trending", "Popular", "Newest", "Free"].map(
        (category, index) => (
          <Button
            variant="tertiary"
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            <Text>{category}</Text>
          </Button>
        ),
      )}
    </div>
  );
};

export default Header;
