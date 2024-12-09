import {Link, AccountConnection} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function Contact() {
  const [connected, setConnected] = useState(false);
  const accountName = connected ? 'Jane Appleseed' : '';

  const handleAction = useCallback(() => {
    setConnected((connected) => !connected);
  }, []);

  const buttonText = connected ? 'Disconnect' : 'Connect';
  const details = connected ? 'Account connected' : 'No account connected';
  const terms = connected ? null : (
    <p>
      Send me an email: muscled.clients1@gmail.com
    </p>
  );

  return (
    <AccountConnection
      accountName={accountName}
      connected={connected}
      title="Need help?"
      action={{
        content: buttonText,
        onAction: handleAction,
      }}
      details={details}
      termsOfService={terms}
    />
  );
}