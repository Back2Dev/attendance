import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Typography, Link } from "@material-ui/core";

export default function NotFound() {
  return (
    <div>
      <Typography variant="h1">404 Page Not Found</Typography>
      <Link component={RouterLink} to="/">
        Back to homepage
      </Link>
    </div>
  );
}
