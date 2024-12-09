import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import translations from "@shopify/polaris/locales/en.json";
import { NavMenu } from "@shopify/app-bridge-react";


export const links = () => [{ rel: "stylesheet", href: polarisStyles }];


export const loader = async ({ context }) => {
  const { shopSession, admin, apiKey } = context;
  return { apiKey, shop: shopSession.shop, admin };
};

export default function App() {
  const { apiKey, shop, admin } = useLoaderData();
  console.log(admin)
  const appBridgeConfig = {
    apiKey: apiKey,
    shopOrigin: shop,
    forceRedirect: true,
  };

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} i18n={translations} config={appBridgeConfig}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {admin && <Link to="/app/admin">Admin</Link>}
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
