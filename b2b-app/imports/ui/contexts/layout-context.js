import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import DefaultLayout from "/imports/ui/layouts/default.js";
import SingleLayout from "/imports/ui/layouts/single.js";

export const LayoutContext = React.createContext("layout");

export const LayoutProvider = (props) => {
  const { children, layout: defaultLayout } = props;

  const { search: searchQuery } = useLocation();
  const search = queryString.parse(searchQuery);

  const [layout, setLayout] = useState(
    search.layout || defaultLayout || "default"
  );

  useEffect(() => {
    setLayout(search.layout || defaultLayout || "default");
  }, [search.layout, defaultLayout]);

  let TheLayout;
  switch (layout) {
    case "single":
      TheLayout = SingleLayout;
      break;

    default:
      TheLayout = DefaultLayout;
      break;
  }

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <TheLayout>{children}</TheLayout>
    </LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
  layout: PropTypes.string,
};

LayoutProvider.defaultProp = {
  layout: "default",
};

export const LayoutConsumer = LayoutContext.Consumer;
