import OtherUserProfileCompo from "@/components/(normail-web-compo)/other-user-com";
import React from "react";

const OtherUserProfile = ({ params }: { params: any }) => {
  const { userId } = params;
  return (
    <div>
      <OtherUserProfileCompo userId={userId}></OtherUserProfileCompo>
    </div>
  );
};

export default OtherUserProfile;
