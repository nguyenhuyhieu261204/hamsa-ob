/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import { Product, useAppBridge } from "@shopify/app-bridge-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function NewBundle() {
  const { apiKey } = useLoaderData<typeof loader>();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleResourcePicker = async () => {
    // Using App Bridge to open the resource picker for products
    if (!shopify) return;

    const selected = await shopify.resourcePicker({
      type: "product",
      multiple: true,
      action: "select",
    });

    if (selected) {
      setSelectedProducts(selected);
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return (
    <s-page heading="Create New Bundle">
      <s-section heading="Bundle Details">
        <s-text-field
          name="bundleName"
          label="Bundle Name"
          placeholder="Enter bundle name"
          required
        ></s-text-field>
        <s-text-area
          name="bundleDescription"
          label="Description"
          placeholder="Describe your bundle"
          rows={3}
        ></s-text-area>
      </s-section>

      <s-section heading="Products in Bundle">
        <s-stack gap="base">
          <s-button variant="secondary" onClick={handleResourcePicker}>
            Browse Products
          </s-button>

          {/* Display selected products */}
          {selectedProducts.length > 0 ? (
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-heading>
                Selected Products ({selectedProducts.length})
              </s-heading>
              <s-stack gap="base">
                {selectedProducts.map((product, index) => {
                  // Extract first image from product images
                  const productImage =
                    product.images && product.images.length > 0
                      ? product.images[0].originalSrc
                      : null;

                  // Extract price from first variant
                  const productPrice =
                    product.variants && product.variants.length > 0
                      ? product.variants[0].price
                      : null;

                  return (
                    <s-stack
                      key={index}
                      gap="base"
                      padding="base"
                      borderWidth="base"
                      borderRadius="base"
                      direction="inline"
                    >
                      {/* Product Image Container */}
                      <s-box paddingInlineEnd="base">
                        {productImage ? (
                          <s-image
                            src={productImage}
                            alt={product.title}
                            aspectRatio="1/1"
                            objectFit="cover"
                            borderRadius="small"
                          />
                        ) : (
                          <s-box
                            background="subdued"
                            borderRadius="small"
                            blockSize="auto"
                            inlineSize="auto"
                          >
                            <s-stack
                              gap="none"
                              blockSize="100%"
                              inlineSize="100%"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <s-icon type="image" color="subdued" />
                            </s-stack>
                          </s-box>
                        )}
                      </s-box>

                      {/* Product Title and Price */}
                      <s-stack gap="small">
                        <s-text fontVariantNumeric="tabular-nums">
                          {product.title}
                        </s-text>
                        {productPrice && (
                          <s-text
                            color="subdued"
                            fontVariantNumeric="tabular-nums"
                          >
                            ${productPrice}
                          </s-text>
                        )}
                      </s-stack>

                      {/* Product Actions */}
                      <s-button
                        variant="tertiary"
                        tone="critical"
                        onClick={() => removeProduct(index)}
                        icon="delete"
                      />
                    </s-stack>
                  );
                })}
              </s-stack>
            </s-box>
          ) : (
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-paragraph>No products added to bundle yet</s-paragraph>
            </s-box>
          )}
        </s-stack>
      </s-section>

      <s-section heading="Pricing">
        <s-stack direction="inline" gap="base">
          <s-number-field
            name="bundlePrice"
            label="Bundle Price"
            placeholder="0.00"
            prefix="$"
          ></s-number-field>
          <s-checkbox
            label="Show original price when items are sold separately"
            name="showOriginalPrice"
          ></s-checkbox>
        </s-stack>
      </s-section>

      <s-button-group slot="primary-action">
        <s-button variant="primary">Create Bundle</s-button>
        <s-button variant="secondary">Save as Draft</s-button>
      </s-button-group>
    </s-page>
  );
}
