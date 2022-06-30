import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const message = useSelector((state) => state.notification);

  return <div>{message}</div>;
};

export default Notification;
