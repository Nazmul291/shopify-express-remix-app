import React, { useState, useCallback, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Frame,
  Card,
  Box,
  Button,
  Icon,
  Text,
  Tag,
  Toast,
  BlockStack,
  InlineStack,
  InlineGrid,
} from "@shopify/polaris";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  XIcon,
  LogoMetaIcon,
  PlusCircleIcon,
  ProductIcon,
} from "@shopify/polaris-icons";
import "./modal.css";

export default function Modal({
  trendingItems,
  isOpen,
  onClose,
  children,
  item,
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const fetcher = useFetcher();
  const [formSubmitted, setFormSubmitted] = useState(false); // Add this flag

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (item && trendingItems && trendingItems[0]) {
      setImages(trendingItems[0].signedImageUrls);
    }
  }, [item, trendingItems]);

  useEffect(() => {
    if (item && item.signedImageUrl) {
      setImages((prevImages) => [item.signedImageUrl, ...prevImages.slice(1)]);
    }
  }, [item]);

  const handleClick = useCallback(async () => {
    if (item) {
      setLoading(true);
      const formData = new FormData();
      formData.append("sectionId", item.id);
      formData.append("status", item.pricingType);
      formData.append("name", item.name);
      let Price = item.price - item.discount;
      formData.append("price", Price);

      fetcher.submit(formData, { action: "/app/explore", method: "post" });
      setFormSubmitted(true);
    }
  }, [fetcher, item]);

  useEffect(() => {
    if (formSubmitted && fetcher.state === "idle" && fetcher.data) {
      if (item && item.pricingType === "free") {
        setToastContent("Section added for free!");
      } else if (item) {
        const response = fetcher.data.response;
        console.log(
          `this is our fetcher data: ${response.data.appPurchaseOneTimeCreate.confirmationUrl}`,
        );
        const checkoutUrl =
          response.data.appPurchaseOneTimeCreate.confirmationUrl;
        // window.open(checkoutUrl);
        window.top.location.href = checkoutUrl;
        // setToastContent("Purchase successful!");
        console.log("Checkout URL:", checkoutUrl);
      } else {
        setToastContent("Error: Item is undefined.");
      }
      setToastActive(true);
      setLoading(false);
      setFormSubmitted(false); // Reset the flag after processing
    }
  }, [fetcher.state, fetcher.data, item, formSubmitted]);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1,
    );
  }, []);

  const handleNext = useCallback(() => {
    setSelectedImage((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0,
    );
  }, []);

  const toggleToastActive = useCallback(() => {
    setToastActive(false);
  }, []);

  useEffect(() => {
    if (toastActive) {
      const timer = setTimeout(() => setToastActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastActive]);

  if (!isOpen || !item) return null;

  return (
    <div className="my-modal-overlay">
      <div className="my-modal">
        <Frame>
          <Card
            padding={0}
            title={item.name}
            secondaryActions={[
              {
                content: "Delete",
                icon: DeleteIcon,
                destructive: true,
                accessibilityLabel: "Secondary action label",
                onAction: () => alert("Delete action"),
              },
            ]}
          >
            <BlockStack gap="200">
              <div className="top">
                <InlineStack align="space-between">
                  <Box>
                    <Text fontWeight="bold">{item.name}</Text>
                  </Box>
                  <Box>
                    <Button onClick={onClose}>
                      <Icon source={XIcon} tone="base" />
                    </Button>
                  </Box>
                </InlineStack>
              </div>
              <div
                className="modal-content"
                style={{ background: "#F1F2F4", padding: "18px" }}
              >
                <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
                  <BlockStack gap="400">
                    <Card roundedAbove="sm" padding="0xp">
                      <BlockStack gap="400">
                        <Box
                          border="divider"
                          borderRadius="base"
                          minHeight="2rem"
                        >
                          <div className="parent">
                            <img
                              src={images[selectedImage]}
                              style={{ width: "100%" }}
                            />
                            <button
                              className="arrow-button arrow-left"
                              onClick={handlePrevious}
                            >
                              <Icon source={ChevronLeftIcon} />
                            </button>
                            <button
                              className="arrow-button arrow-right"
                              onClick={handleNext}
                            >
                              <Icon source={ChevronRightIcon} />
                            </button>
                            <div className="circle-indicators">
                              {images.map((_, index) => (
                                <span
                                  key={index}
                                  className={`circle ${index === selectedImage ? "filled" : ""}`}
                                  onClick={() => setSelectedImage(index)}
                                ></span>
                              ))}
                            </div>
                          </div>
                        </Box>
                        <Box>
                          <div className="thumbnail-container ">
                            <InlineStack>
                              {images.map((img, index) => (
                                <Box key={index}>
                                  <div style={{ padding: "0px 5px" }}>
                                    <img
                                      src={img}
                                      onClick={() => setSelectedImage(index)}
                                    />
                                  </div>
                                </Box>
                              ))}
                            </InlineStack>
                          </div>
                        </Box>
                        <Box>
                          <div style={{ padding: "10px" }}>
                            <Text variant="bodyLg" as="p" color="subdued">
                              {item.description}
                            </Text>
                          </div>
                        </Box>
                      </BlockStack>
                    </Card>
                  </BlockStack>
                  <BlockStack gap={{ xs: "400", md: "200" }}>
                    <Card roundedAbove="sm">
                      <BlockStack gap="200">
                        <Box
                          border="divider"
                          borderRadius="base"
                          minHeight="1rem"
                        >
                          <InlineStack align="space-between">
                            <Text>{item.name}</Text>
                            <Text>
                              {item.pricingType === "free"
                                ? "Free"
                                : `${item.price - item.discount}$`}
                            </Text>
                          </InlineStack>
                        </Box>
                        <Box
                          border="divider"
                          borderRadius="base"
                          minHeight="1rem"
                        >
                          <Tag>{item.tags}</Tag>
                        </Box>
                        <BlockStack gap="100" align="start">
                          <Box
                            border="divider"
                            borderRadius="base"
                            minHeight="1rem"
                          >
                            <InlineStack align="start">
                              <div style={{ display: "flex" }}>
                                <Icon source={LogoMetaIcon} tone="base" />
                              </div>
                              <Text alignment="start">
                                Buy once, own forever
                              </Text>
                            </InlineStack>
                          </Box>
                          <Box
                            border="divider"
                            borderRadius="base"
                            minHeight="1rem"
                          >
                            <InlineStack align="start">
                              <div style={{ display: "flex" }}>
                                <Icon source={PlusCircleIcon} tone="base" />
                              </div>
                              <Text alignment="start">
                                Add section to any theme
                              </Text>
                            </InlineStack>
                          </Box>
                          <Box
                            border="divider"
                            borderRadius="base"
                            minHeight="1rem"
                          >
                            <InlineStack align="start">
                              <div style={{ display: "flex" }}>
                                <Icon source={ProductIcon} tone="base" />
                              </div>
                              <Text alignment="start">
                                One-time charge (never recurring)
                              </Text>
                            </InlineStack>
                          </Box>
                        </BlockStack>
                        <Box
                          border="divider"
                          borderRadius="base"
                          minHeight="1rem"
                        >
                          <Button
                            icon={ProductIcon}
                            variant="primary"
                            fullWidth
                            onClick={handleClick}
                            loading={loading}
                          >
                            {item.pricingType === "free"
                              ? "Get free Section"
                              : "Purchase"}
                          </Button>
                        </Box>
                        <Box
                          border="divider"
                          borderRadius="base"
                          minHeight="1rem"
                        >
                          {/* <Button fullWidth>Try section</Button> */}
                        </Box>
                      </BlockStack>
                    </Card>
                    <Card roundedAbove="sm">
                      <Box
                        border="divider"
                        borderRadius="base"
                        minHeight="1rem"
                      >
                        <Text fontWeight="bold">Preview</Text>
                        <img
                          src={images[0]}
                          style={{ width: "100%", height: "150px" }}
                          alt=""
                        />
                      </Box>
                    </Card>
                  </BlockStack>
                </InlineGrid>
              </div>
            </BlockStack>
          </Card>
          {toastActive && (
            <div className="showToast">
              <Toast
                content={toastContent}
                duration={3000}
                onDismiss={toggleToastActive}
              />
            </div>
          )}
        </Frame>
      </div>
    </div>
  );
}
