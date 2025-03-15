import NotificationComp from "@/components/author/notifications-comp";
import React from "react";

const Notifications = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-20 w-[80%] md:w-[60%]  ">
        <NotificationComp></NotificationComp>
      </div>
    </div>
  );
};

export default Notifications;
