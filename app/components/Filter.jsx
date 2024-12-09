import { IndexFilters, useSetIndexFiltersMode } from "@shopify/polaris";

import { useState, useCallback, useEffect } from "react";
import MySection from "./MySection";

export default function Filter({ mysections, themeId }) {
  const [filteredSections, setFilteredSections] = useState(mysections);
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState(0);
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const filters = [];
  const appliedFilters = [];
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Popular",
    "Trending",
    "Newest",
  ]);

  const applyFilters = useCallback(() => {
    let filtered = [...mysections];

    // Sort the sections based on the selected sorting option
    switch (sortSelected[0]) {
      case "order asc":
        filtered.sort((a, b) => a.order - b.order);
        break;
      case "order desc":
        filtered.sort((a, b) => b.order - a.order);
        break;
      case "date asc":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "date desc":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    // Apply other filters
    if (selected !== 0) {
      const selectedTab = itemStrings[selected].toLowerCase();
      filtered = filtered.filter((section) => {
        return (
          section.category.toLowerCase() === selectedTab ||
          section.name.toLowerCase() === selectedTab
        );
      });
    }

    // Apply search query filter
    if (searchValue) {
      filtered = filtered.filter((section) =>
        section.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    setFilteredSections(filtered);
  }, [mysections, searchValue, selected, sortSelected, itemStrings]);

  // Update filtered sections whenever filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCardClick = (themeId, itemId) => {
    console.log("");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const sortOptions = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
  ];

  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {
    setSearchValue("");
  };

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };

  return (
    <>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={searchValue}
        queryPlaceholder="Searching in all"
        onQueryChange={setSearchValue}
        onSort={setSortSelected}
        primaryAction={primaryAction}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView
        onCreateNewView={onCreateNewView}
        filters={filters}
        appliedFilters={appliedFilters}
        mode={mode}
        setMode={setMode}
      />
      <MySection
        trendingItems={filteredSections}
        onAction={handleCardClick}
        themeId={themeId}
      />
    </>
  );
}
