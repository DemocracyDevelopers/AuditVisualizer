// mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import React from "react";

const withDataContent = (
  Component: React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>>,
) => {
  return (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const { children, ...rest } = props;

    const textContent = String(children);

    // generate a unique ID based on the text content
    const headingId =
      props.id || textContent.toLowerCase().replace(/\s+/g, "-");

    return (
      <Component {...rest} id={headingId} data-content={textContent}>
        {children}
      </Component>
    );
  };
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: withDataContent((props) => (
      <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
    )),
    h2: withDataContent((props) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
    )),
    h3: withDataContent((props) => (
      <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
    )),
    h4: (props) => <h4 className="text-lg font-semibold mb-4" {...props} />,
    p: (props) => <p className="text-lg text-gray-700 mb-8" {...props} />,
    ol: (props) => (
      <ol
        className="list-decimal ml-6 text-gray-700 text-lg space-y-2"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="list-disc ml-6 text-gray-700 text-lg space-y-2"
        {...props}
      />
    ),
  };
}
