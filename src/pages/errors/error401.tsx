import CommonErrorPage from "@/components/Others/Error/common/CommonErrorPage";

const Error401 = () => {
  return (
    <CommonErrorPage
      tittle={401}
      tittleClassName="font-warning"
      BtnClassName="btn-warning-gradien"
    />
  );
};

export default Error401;
