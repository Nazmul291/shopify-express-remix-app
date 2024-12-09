import { CalloutCard, Frame, Toast } from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import RequestSectionModal from "./RequestSection-modal";

export default function RequestSection() {
  const [active, setActive] = useState(false);
  const [toastActive, setToastActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);
  const toggleToast = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    [],
  );

  const handleChange = useCallback(() => setActive(!active), [active]);

  const toastMarkup = toastActive ? (
    <div style={{ height: "0px" }}>
      <Frame>
        <Toast content="Request submitted" onDismiss={toggleToast} />
      </Frame>
    </div>
  ) : null;

  return (
    <div>
      <CalloutCard
        title="Didn't find what you were looking for?"
        illustration="/assets/navigationIconsImages/free-trial.svg"
        primaryAction={{
          content: "Request a section",
          onAction: handleChange,
          tone: "success",
          variant: "primary",
        }}
      >
        <p>
          Start your risk-free trial today and experience the power of
          effortless store design.
        </p>
        <br />
        <br />
      </CalloutCard>

      <RequestSectionModal
        active={active}
        handleChange={handleChange}
        toggleToast={toggleToast}
        toggleModal={toggleModal}
      />

      {toastMarkup}
    </div>
  );
}
