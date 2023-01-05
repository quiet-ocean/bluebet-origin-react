import React from "react";
import { Redirect } from "react-router-dom";

const AffiliatesRedirect = ({ match }) => {
  // Set affiliate code to localStorage
  window.localStorage.setItem("affiliateCode", match.params.affiliateCode);

  // Redirect to affiliates page
  return <Redirect to="/affiliates" />;
};

export default AffiliatesRedirect;
