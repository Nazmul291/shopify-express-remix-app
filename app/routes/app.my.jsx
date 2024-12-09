import React, { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Link,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import mystyle from "../components/MyAPP.css?url";
import Filter from "../components/Filter";

export const links = () => [{ rel: "stylesheet", href: mystyle }];

export default function My() {
  const [sections, setSections] = useState([]);
  const [themeId, setThemeId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/my");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSections(data.sections);
        setThemeId(data.themeId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Page fullWidth>
      <Layout.Section>
        <Filter mysections={sections} themeId={themeId} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BlockStack style={{ margin: "20px auto" }}>
            <InlineStack gap="100" align="end">
              <Text variant="bodyLg" as="p" alignment="center">
                Didn't find what you were looking for?
              </Text>
              <Link url="https://help.shopify.com/manual">
                Request a section.
              </Link>
            </InlineStack>
          </BlockStack>
        </div>
      </Layout.Section>
    </Page>
  );
}
