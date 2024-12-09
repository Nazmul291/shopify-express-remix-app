import {
  Frame,
  Page,
  Pagination,
  Layout,
  Button,
  Text,
  InlineStack,
  Toast,
  Popover,
  ActionList,
  BlockStack,
  Card,
  FooterHelp,
  Grid,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import styles from "../components/sectionExplore.module.css";
import categoryIcons from "../json/categoryIcon.json";
import SearchBar from "../components/SearchBar.jsx";
import EmptyStateCom from "../components/EmptyStateCom";
import Modal from "../components/Modal";
import RequestSection from "../components/RequestSection";
import Header from "../components/Header";
import RequestSectionModal from "../components/RequestSection-modal.jsx";
import TrendingNowSection from "../components/TrendingNowSection";

export default function Explore() {
  const [sections, setSections] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filtered, setFiltered] = useState([]);
  const [sortOption, setSortOption] = useState();
  const [popoverActive, setPopoverActive] = useState(false);
  const [active, setActive] = useState(false); // **New state**
  const [toastActive, setToastActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);
  const toggleToast = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    []
  ); // **New handler**
  const handleChange = useCallback(() => setActive(!active), [active]);

  const handleSearchChange = useCallback((newValue) => {
    setSearchValue(newValue);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (item) => {
    setActiveItemId(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveItemId(null);
  };

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleSortChange = useCallback((value) => {
    setSortOption(value);
    setPopoverActive(false); // Close popover after selection
  }, []);

  useEffect(() => {
    let filteredSections = sections;
    if (
      selectedCategory &&
      selectedCategory !== "All Sections" &&
      selectedCategory !== "Free"
    ) {
      filteredSections = filteredSections.filter(
        (section) =>
          section.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedCategory == "Free") {
      filteredSections = filteredSections.filter(
        (section) =>
          section.pricingType.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchValue) {
      filteredSections = filteredSections.filter((section) =>
        section.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (sortOption) {
      filteredSections = [...filteredSections].sort((a, b) => {
        if (sortOption === "A to Z") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "Z to A") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
    }
    setFiltered(filteredSections);
  }, [sections, selectedCategory, searchValue, sortOption]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/explore");
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections);
          setFiltered(data.sections);
        } else {
          setSections([]);
          setFiltered([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSections([]);
        setFiltered([]);
      }
    };

    fetchData();
  }, []);

  const toastMarkup = toastActive ? ( // **New toast markup**
    <Frame>
      <Toast content="Request submitted" onDismiss={toggleToast} />
    </Frame>
  ) : null;

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Header handleCategoryClick={handleCategoryClick} />
          <div className={styles.freeTrial}>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6 }}>
                <RequestSection onClick={toggleModal} /> {/* **Updated** */}
              </Grid.Cell>
            </Grid>
          </div>
          <BlockStack gap="4">
            <Card sectioned>
              <Text variant="headingLg" as="h5">
                Choose your section
              </Text>
            </Card>

            <Card sectioned>
              <div className={styles.search}>
                <div className={styles["search-bar"]}>
                  <SearchBar
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className={styles["sort-button"]}>
                  <Popover
                    active={popoverActive}
                    activator={
                      <Button onClick={togglePopoverActive}>
                        <img
                          src="/assets/sort_minor.png"
                          alt="Sort Icon"
                          className={styles["sort-icon"]}
                        />
                        Sort
                      </Button>
                    }
                    onClose={togglePopoverActive}
                  >
                    <ActionList
                      items={[
                        {
                          content: "A to Z",
                          onAction: () => handleSortChange("A to Z"),
                        },
                        {
                          content: "Z to A",
                          onAction: () => handleSortChange("Z to A"),
                        },
                      ]}
                    />
                  </Popover>
                </div>
              </div>

              <div className={styles.categoryButton}>
                <InlineStack>
                  {categoryIcons?.map((button, index) => (
                    <Button
                      key={index}
                      variant="tertiary"
                      onClick={() => handleCategoryClick(button.text)}
                    >
                      <Text>{button.text}</Text>
                    </Button>
                  ))}
                </InlineStack>
              </div>

              {filtered.length > 0 ? (
                <TrendingNowSection
                  trendingItems={filtered}
                  searchQuery={searchValue}
                  onAction={handleCardClick}
                  session={initialData.isAdminShop}
                />
              ) : (
                <EmptyStateCom message="Data is empty" /> // Update to show empty message
              )}
            </Card>
          </BlockStack>
          <FooterHelp>
            Didn't find what you were looking for?{" "}
            <Button variant="plain" onClick={toggleModal}>
              {" "}
              Request a section
            </Button>{" "}
          </FooterHelp>
          <RequestSectionModal
            active={active}
            handleChange={handleChange}
            toggleModal={toggleModal}
            toggleToast={toggleToast}
          />
          <Modal
            trendingItems={sections}
            isOpen={isModalOpen}
            item={activeItemId}
            onClose={handleCloseModal}
          />
          {toastMarkup} {/* **New toast component** */}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
