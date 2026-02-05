import React from "react";
import PropTypes from "prop-types";

import { CssBaseline } from "@mui/material";

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
