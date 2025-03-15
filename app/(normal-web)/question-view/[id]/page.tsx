import QuestionViewCompo from "@/components/(normail-web-compo)/question-view-component";
import React from "react";

const QustionView = ({ params }: { params: any }) => {
  const { id } = params;
  return (
    <div>
      <QuestionViewCompo id={id}></QuestionViewCompo>
    </div>
  );
};

export default QustionView;
