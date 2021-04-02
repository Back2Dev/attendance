import React from "react";
import PropTypes from "prop-types";

import { CssBaseline } from "@material-ui/core";

export default function SingleLayout({ children }) {
  return (
    <div className="single-layout">
      <CssBaseline />
      {children}
    </div>
  );
}

SingleLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
