import {
  Box,
  Card,
  Page,
  BlockStack,
  Button,
  Collapsible,
  LegacyCard,
  LegacyStack,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import faqData from "../json/faqData.json";
import { useLoaderData } from "@remix-run/react";
import {  PlusIcon } from "@shopify/polaris-icons";

export const loader = () => {
  return { faqData };
};

export default function Help() {
  const [openStates, setOpenStates] = useState({});
  const { faqData } = useLoaderData();

  const handleToggle = useCallback((id) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  return (
    <Page>
      <LegacyCard sectioned>
        <TitleBar title="Frequently asked questions" />
        <LegacyStack vertical>
          {faqData &&
            faqData.map((faq) => (
              <div key={faq.id}>
                <Card sectioned>
                  <BlockStack vertical>
                    <Button
                      onClick={() => handleToggle(faq.id)}
                      ariaExpanded={openStates[faq.id] || false}
                      ariaControls={`collapsible-${faq.id}`}
                      textAlign="left"
                      variant="monochromePlain"
                      icon={PlusIcon}
                    >
                      <div className="Queastion-style">
                        <Text variant="headingSm" as="h3" fontWeight="bold">
                          {faq.question}
                        </Text>
                      </div>
                    </Button>
                    <Collapsible
                      open={openStates[faq.id] || false}
                      id={`collapsible-${faq.id}`}
                      transition={{
                        duration: "500ms",
                        timingFunction: "ease-in-out",
                      }}
                      expandOnPrint
                    >
                      <BlockStack>
                        <p style={{ padding: "15px" }}>{faq.answer}</p>
                      </BlockStack>
                    </Collapsible>
                  </BlockStack>
                </Card>
              </div>
            ))}
        </LegacyStack>
      </LegacyCard>
      {/* <FAQOP/>   */}
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
