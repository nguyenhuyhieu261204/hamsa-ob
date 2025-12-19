import { useNavigate, type LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function BundleProducts() {
  const navigate = useNavigate();

  return (
    <s-page heading="Bundle Products">
      <s-button
        slot="primary-action"
        variant="primary"
        onClick={() => navigate("/app/bundle/new")}
      >
        Create Bundle
      </s-button>

      <s-section heading="Manage your product bundles">
        <s-paragraph>
          Bundles allow you to group products together and sell them as a
          package.
        </s-paragraph>
        <s-paragraph>
          Create a new bundle to get started or manage existing bundles.
        </s-paragraph>
      </s-section>

      <s-section slot="aside" heading="Bundle Information">
        <s-unordered-list>
          <s-list-item>
            <s-text>
              Create product bundles to increase average order value
            </s-text>
          </s-list-item>
          <s-list-item>
            <s-text>Offer discounts on bundled items</s-text>
          </s-list-item>
          <s-list-item>
            <s-text>Track bundle performance separately</s-text>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
