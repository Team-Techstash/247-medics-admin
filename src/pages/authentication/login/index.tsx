import CommonLogo from "@/components/Others/authentication/common/CommonLogo";
import { Col, Container, Row } from "reactstrap";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { Facebook, Linkedin, Twitter } from "react-feather";
import { Button, FormGroup, Input, Label } from "reactstrap";
import {
  CreateAccount,
  DoNotAccount,
  EmailAddress,
  EnterEmailPasswordLogin,
  FacebookHeading,
  ForgotPassword,
  Password,
  RememberPassword,
  SignIn,
  SignInAccount,
  SignInWith,
  TwitterHeading,
  linkedInHeading,
} from "utils/Constant";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { authService } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { User } from "@/context/UserContext";

const Login = () => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formValues;
  const router = useRouter();
  const { setUser } = useUser();

  const handleUserValue = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const formSubmitHandle = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.loginWithEmail({ email, password });
      Cookies.set("token", response.token);
      // Store user info in cookies and context
      Cookies.set("userInfo", JSON.stringify(response.user));
      setUser(response.user as unknown as User);
      router.push("/dashboard/default");
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs={12} className="p-0">
          <div className="login-card login-dark">
            <div>
              <div>
                <CommonLogo />
              </div>
              <div className="login-main">
                <form className="theme-form" onSubmit={formSubmitHandle}>
                  <h4>{SignInAccount}</h4>
                  <p>{EnterEmailPasswordLogin}</p>
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      name="email"
                      onChange={handleUserValue}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">{Password}</Label>
                    <div className="form-input position-relative">
                      <Input
                        type={showPassWord ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={handleUserValue}
                        value={password}
                        name="password"
                        required
                      />
                      <div className="show-hide">
                        <span
                          onClick={() => setShowPassWord(!showPassWord)}
                          className={!showPassWord ? "show" : ""}
                        />
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0 form-group">
                    <div className="text-end mt-3">
                      <Button
                        color="primary"
                        className="btn-block w-100"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : SignIn}
                      </Button>
                    </div>
                  </FormGroup>
                </form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
