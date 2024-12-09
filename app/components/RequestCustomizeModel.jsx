import {
  Button,
  Modal,
  LegacyStack,
  Frame,
  TextField,
  DropZone,
  Thumbnail,
  BlockStack,
  Toast,
  InlineError,
  Text,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import "./Request.module.css";

export default function RequestCustomizeModel() {
  const [active, setActive] = useState(false);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [toastActive, setToastActive] = useState(false);
  const [error, setError] = useState("");

  const toggleModal = useCallback(() => setActive((active) => !active), []);
  const toggleToast = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    [],
  );

  const handleDescriptionChange = useCallback(
    (value) => setDescription(value),
    [],
  );
  const handleUrlChange = useCallback((value) => setUrl(value), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles) => setFile(acceptedFiles[0]),
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!description) {
      setError("Description is required.");
      return;
    }

    console.log(`Description:${description}`);
    console.log(`url:${url}`);
    console.log(`file:${file.name}`);
    console.log("working..............................................");
    const formData = new FormData();
    formData.append("description", description);
    formData.append("url", url);
    if (file) {
      formData.append("file", file, file.name);
    }

    try {
      const response = await fetch("/email-manager", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setToastActive(true);
        setDescription("");
        setUrl("");
        setError("");
        setFile(null);
        toggleModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit request.");
      }
    } catch (error) {
      setError("Failed to submit request. Please try again.");
    }
  }, [description, url, file, toggleModal]);

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const toastMarkup = toastActive ? (
    <div style={{ height: "0px" }}>
      <Frame>
        <Toast content="Request submitted" onDismiss={toggleToast} />
      </Frame>
    </div>
  ) : null;

  return (
    <div>
      <Modal
        activator={
          <Button primary fullWidth onClick={toggleModal}>
            Request customization
          </Button>
        }
        open={active}
        onClose={toggleModal}
        title="Request for customization"
        primaryAction={{
          content: "Submit Request",
          onAction: handleSubmit,
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <Text variant="headingSm" as="h6">
                We are pleased to offer you the opportunity to request
                customizations for your store. This service allows you to tailor
                various aspects of your store to better fit your unique needs
                and preferences.
              </Text>
            </LegacyStack.Item>
            <LegacyStack.Item>
              <TextField
                label="Description"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                autoComplete="off"
                requiredIndicator
                multiline
              />
              {error === "Description is required." && (
                <InlineError message={error} fieldID="description" />
              )}
            </LegacyStack.Item>
            <LegacyStack.Item>
              <TextField
                label="Please provide a referance url (optional)"
                value={url}
                onChange={handleUrlChange}
                autoComplete="off"
              />
            </LegacyStack.Item>
            <LegacyStack.Item>
              <DropZone
                onDrop={handleDropZoneDrop}
                label="Please upload a referance image (optional)"
                type="image"
              >
                {file && (
                  <BlockStack vertical>
                    {validImageTypes.includes(file.type) ? (
                      <Thumbnail
                        size="large"
                        alt={file.name}
                        source={URL.createObjectURL(file)}
                      />
                    ) : (
                      <div>{file.name}</div>
                    )}
                  </BlockStack>
                )}
                {!file && <DropZone.FileUpload />}
              </DropZone>
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
      {toastMarkup}
    </div>
  );
}
