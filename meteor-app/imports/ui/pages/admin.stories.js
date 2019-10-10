import React from "react";
import { action } from "@storybook/addon-actions";
import Admin from "./admin";

const stuffs = [{ name: "Jack" }, { name: "Mike" }];

export default {
  title: "Admin"
};

export const text = () => <Admin stuffs={stuffs} />;
