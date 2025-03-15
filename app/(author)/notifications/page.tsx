import NotificationComp from "@/components/author/notifications-comp";
import React from "react";

const Notifications = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mt-10 w-[80%] md:w-[60%]  ">
        <NotificationComp></NotificationComp>
      </div>
    </div>
  );
};

export default Notifications;
