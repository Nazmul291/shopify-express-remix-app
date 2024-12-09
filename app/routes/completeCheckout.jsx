import { useEffect, useState } from "react";
import { useLoaderData, useSubmit } from "@remix-run/react";

export default function ConfirmPurchase() {
  const data = useLoaderData();
  const submit = useSubmit();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  console.log(JSON.stringify(data));

  useEffect(() => {
    if (data.sessionStatus === "SUCCESS" && !hasSubmitted) {
      const formData = new FormData();
      formData.append("sectionId", data.sectionId);
      formData.append("status", data.sessionStatus);

      try {
        submit(formData, {
          method: "post",
          encType: "multipart/form-data",
        });
        setHasSubmitted(true);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  }, [data.sessionStatus, data.sectionId, submit, hasSubmitted]);

  if (data.error) {
    return <div>Error: {data.message}</div>;
  }

  return <div>Purchase Status: {data.sessionStatus}</div>;
}
