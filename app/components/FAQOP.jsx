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
  InlineStack,
  Icon,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import faqData from "../faqData.json";
import { useLoaderData } from "@remix-run/react";
import {
  PlusCircleIcon,
  PlusIcon,
  EditMajor,
  DeleteMinor,
} from "@shopify/polaris-icons";

export const loader = () => {
  return { faqData };
};

export default function FAQOP() {
  const [openStates, setOpenStates] = useState({});
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const { faqData } = useLoaderData();

  const handleToggle = useCallback((id) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  const handleEdit = (faq) => {
    setEditingFaq(faq);
  };

  const handleDelete = (id) => {
    // Implement the delete functionality here
    // For now, we can just log the id
    console.log("Delete FAQ with id:", id);
  };

  const handleSaveEdit = () => {
    // Implement the save edit functionality here
    // For now, we can just log the edited FAQ
    console.log("Save edited FAQ:", editingFaq);
    setEditingFaq(null);
  };

  const handleCreateNew = () => {
    // Implement the create new FAQ functionality here
    // For now, we can just log the new FAQ
    console.log("Create new FAQ:", newFaq);
    setNewFaq({ question: "", answer: "" });
  };

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
                    <InlineStack>
                      <Button
                        onClick={() => handleToggle(faq.id)}
                        ariaExpanded={openStates[faq.id] || false}
                        ariaControls={`collapsible-${faq.id}`}
                        textAlign="left"
                        variant="monochromePlain"
                        icon={PlusIcon}
                      >
                        <div className="Question-style">
                          <Text variant="headingSm" as="h3" fontWeight="bold">
                            {faq.question}
                          </Text>
                        </div>
                      </Button>
                      <Button
                        icon={EditMajor}
                        onClick={() => handleEdit(faq)}
                        plain
                      />
                      <Button
                        icon={DeleteMinor}
                        onClick={() => handleDelete(faq.id)}
                        plain
                      />
                    </InlineStack>
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

          {editingFaq && (
            <Card sectioned>
              <BlockStack vertical>
                <TextField
                  label="Question"
                  value={editingFaq.question}
                  onChange={(value) =>
                    setEditingFaq({ ...editingFaq, question: value })
                  }
                />
                <TextField
                  label="Answer"
                  value={editingFaq.answer}
                  onChange={(value) =>
                    setEditingFaq({ ...editingFaq, answer: value })
                  }
                  multiline={4}
                />
                <Button onClick={handleSaveEdit}>Save</Button>
                <Button onClick={() => setEditingFaq(null)} plain>
                  Cancel
                </Button>
              </BlockStack>
            </Card>
          )}

          <Card sectioned>
            <BlockStack vertical>
              <Text variant="headingSm" as="h3" fontWeight="bold">
                Add New FAQ
              </Text>
              <TextField
                label="Question"
                value={newFaq.question}
                onChange={(value) => setNewFaq({ ...newFaq, question: value })}
              />
              <TextField
                label="Answer"
                value={newFaq.answer}
                onChange={(value) => setNewFaq({ ...newFaq, answer: value })}
                multiline={4}
              />
              <Button onClick={handleCreateNew}>Add</Button>
            </BlockStack>
          </Card>
        </LegacyStack>
      </LegacyCard>
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
