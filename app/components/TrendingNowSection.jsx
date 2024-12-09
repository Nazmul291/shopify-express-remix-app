import React, { useState, useCallback } from "react";
import {
  Card,
  Button,
  BlockStack,
  Text,
  Box,
  InlineGrid,
  InlineStack,
  Toast,
  Frame,
} from "@shopify/polaris";
import { useFetcher } from "@remix-run/react";
import { DeleteIcon } from "@shopify/polaris-icons";

export default function TrendingNowSection({
  trendingItems,
  searchQuery,
  onAction,
}) {
  const fetcher = useFetcher();
  const [active, setActive] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Section deleted successfully" onDismiss={toggleActive} />
  ) : null;

  const handleCardClick = (value) => {
    onAction(value);
  };

  const handleDeleteClick = (e, id, name, category) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to delete the item "${name}"?`
    );
    if (confirmed) {
      const formData = new FormData();
      formData.append("sectionId", id);
      fetcher.submit(formData, { action: "/app/explore", method: "post" });
    }
  };

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setActive(true);
      window.location.reload();
    }
  }, [fetcher]);

  return (
    <Frame>
      <div style={{ paddingTop: "20px" }}>
        <BlockStack gap="500">
          <InlineGrid gap="400" columns={3}>
            {trendingItems.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                style={{ position: "relative" }}
              >
                <Card>
                  <Box maxWidth="200">
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                      src={item.signedImageUrls[0]}
                      alt={item.imageAlt}
                      onClick={() => handleCardClick(item)}
                    />
                  </Box>
                  <Box maxWidth="200" paddingBlockStart="400">
                    <InlineStack wrap={false} align="space-between">
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text fontWeight="bold">
                        {item.pricingType === "free"
                          ? "Free"
                          : `${item.price - item.discount}$`}
                      </Text>
                    </InlineStack>
                  </Box>
                  <Box maxWidth="200">
                    <InlineStack wrap={false} align="space-between">
                      <Text tone="subdued">
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </Text>
                    </InlineStack>
                  </Box>
                  <Box maxWidth="200" paddingBlockStart="400">
                    <button
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: "white",
                        border: "1px solid gray",
                      }}
                      onClick={() => handleCardClick(item)}
                    >
                      View Section
                    </button>
                  </Box>

                  {isAdminShop && hoveredItemId === item.id && (
                    <div
                      className="delete-icon"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        cursor: "pointer",
                        background: "white",
                      }}
                    >
                      <Button
                        icon={DeleteIcon}
                        variant="tertiary"
                        tone="critical"
                        onClick={(e) =>
                          handleDeleteClick(
                            e,
                            item.id,
                            item.name,
                            item.category
                          )
                        }
                        accessibilityLabel="Delete"
                      />
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </InlineGrid>
        </BlockStack>
        {toastMarkup}
      </div>
    </Frame>
  );
}
