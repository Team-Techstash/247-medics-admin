import "../../public/assets/scss/app.scss";
import { useRouter } from "next/router";
import { withoutLayoutThemePath } from "Data/OthersPageData";
import { ToastContainer } from "react-toastify";
import "../../i18n";
import "../../public/assets/scss/app.scss";
import LayoutProvider from "helper/Layout/LayoutProvider";
import Layout from "../layout";
import { CustomizerProvider } from "helper/Customizer/CustomizerProvider";
import ContactProvider from "helper/Contacts/ContactProvider";
import NoSsr from "utils/NoSsr";
import { UserProvider } from '@/context/UserContext';

const Myapp = ({ Component, pageProps }: any) => {
  const getLayout =Component.getLayout || ((page: any) => <Layout>{page}</Layout>);
  const router = useRouter();
  const currentUrl = router.asPath;
  let updatedPath;
  if(currentUrl.includes("?")){
    const tempt=currentUrl
     updatedPath=tempt.split("?")[0]
  }else{
    updatedPath=currentUrl
  }

  return (
    <UserProvider>
      <NoSsr>
        {withoutLayoutThemePath.includes(updatedPath) ? (
          <Component {...pageProps} />
        ) : (
          <CustomizerProvider>
                <LayoutProvider>
                      <ContactProvider>
                        {getLayout(<Component {...pageProps} />)}
                      </ContactProvider>
                </LayoutProvider>
          </CustomizerProvider>
        )}
        <ToastContainer />
      </NoSsr>
    </UserProvider>
  );
};

export default Myapp;
