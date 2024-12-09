import {
  Card,
  Button,
  BlockStack,
  Text,
  Box,
  InlineGrid,
  InlineStack,
  EmptyState,
  LegacyCard,
  Popover,
  ActionList,
  Pagination,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import RequestCustomizeModel from "./RequestCustomizeModel";

export default function MySection({ trendingItems, onAction, themeId }) {
  const [popoverActive, setPopoverActive] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust this number as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trendingItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(trendingItems.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCardClick = (value) => {
    // console.log("value:", value);
    onAction(value);
  };

  const togglePopoverActive = useCallback(
    (id) =>
      setPopoverActive((prevState) => ({ ...prevState, [id]: !prevState[id] })),
    [],
  );

  if (!trendingItems || trendingItems.length === 0) {
    return (
      <LegacyCard sectioned>
        <EmptyState
          heading="No Section Found"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Sorry, we couldn't find any SECTION at the moment. Please try again
            later.
          </p>
        </EmptyState>
      </LegacyCard>
    );
  }

  return (
    <div style={{ background: "#fff", padding: "20px" }}>
      <BlockStack gap="500">
        <InlineGrid gap="400" columns={3}>
          {currentItems.map((item) => (
            <div key={item.id}>
              <Card>
                <Box
                  maxWidth="200"
                  style={{
                    borderColor: "#C4C4C4",
                    borderWidth: "7.526px",
                    borderStyle: "solid",
                    marginBottom: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    style={{ width: "100%" }}
                    src={item.image}
                    alt={item.imageAlt}
                  />
                </Box>
                <Box>
                  <BlockStack gap="400">
                    <InlineStack wrap={false} align="space-between">
                      <Text fontWeight="medium" as="h6">
                        {item.name}
                      </Text>
                    </InlineStack>
                    <BlockStack gap="200">
                      <Popover
                        active={popoverActive[item.id] || false}
                        activator={
                          <Button
                            variant="primary"
                            fullWidth
                            size="large"
                            onClick={() => togglePopoverActive(item.id)}
                          >
                            Add to theme
                          </Button>
                        }
                        autofocusTarget="first-node"
                        onClose={() => togglePopoverActive(item.id)}
                      >
                        <ActionList
                          items={
                            themeId
                              ? themeId.map((theme) => ({
                                  content: theme.name,
                                  onAction: () => handleCardClick(theme.id),
                                }))
                              : []
                          }
                        />
                      </Popover>

                      <RequestCustomizeModel />
                    </BlockStack>
                  </BlockStack>
                </Box>
              </Card>
            </div>
          ))}
        </InlineGrid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0px",
          }}
        >
          <Pagination
            hasPrevious={currentPage > 1}
            onPrevious={handlePreviousPage}
            hasNext={currentPage < totalPages}
            onNext={handleNextPage}
          />
        </div>
      </BlockStack>
    </div>
  );
}
