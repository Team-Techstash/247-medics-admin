import Link from "next/link";
import { commonFormPropsType } from "./CommonForm";
import { AgreeWith, CreateAccount, CreateYourAccount, EmailAddress, EnterYourPersonalDetails, FacebookHeading, HaveAccount, Href, Password, PrivacyPolicy, SignIn, SignUpWith, TwitterHeading, YourName, linkedInHeading } from "utils/Constant";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useState } from "react";
import { Facebook, Linkedin, Twitter } from "react-feather";
import CommonLogo from "./CommonLogo";
import { adminService, CreateAdminData } from "../../../../services/adminService";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const CommonRegisterForm = ({ alignLogo }: commonFormPropsType) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [formData, setFormData] = useState<CreateAdminData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CreateAdminData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminService.createAdmin(formData);
      toast.success("Admin account created successfully!");
      // Wait for 2 seconds to show the toast before redirecting
      setTimeout(() => {
        router.push('/authentication/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create admin account');
      toast.error(err.response?.data?.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card login-dark">
      <div>
        <div>
          <CommonLogo alignLogo={alignLogo} />
        </div>
        <div className="login-main">
          <form className="theme-form" onSubmit={handleSubmit}>
            <h4>{CreateYourAccount}</h4>
            <p>{EnterYourPersonalDetails}</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormGroup>
              <Label className="col-form-label pt-0">{YourName}</Label>
              <Row className="g-2">
                <Col xs={6}>
                  <Input 
                    type="text" 
                    required 
                    placeholder="First name" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col xs={6}>
                  <Input 
                    type="text" 
                    required 
                    placeholder="Last name" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label className="col-form-label">{EmailAddress}</Label>
              <Input 
                type="email" 
                required 
                placeholder="Test@gmail.com" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label className="col-form-label">{Password}</Label>
              <div className="form-input position-relative">
                <Input 
                  type={showPassWord ? "text" : "password"} 
                  placeholder="*********" 
                  required 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="show-hide">
                  <span onClick={() => setShowPassWord(!showPassWord)} className={!showPassWord ? "show" : ""} />
                </div>
              </div>
            </FormGroup>
            <FormGroup className="mb-0">
              <div className="checkbox p-0">
                <Input id="checkbox1" type="checkbox" required />
                <Label className="text-muted" htmlFor="checkbox1">{AgreeWith}<a className="ms-2" href={Href}>{PrivacyPolicy}</a></Label>
              </div>
              <Button 
                color="primary" 
                className="btn-block w-100" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : CreateAccount}
              </Button>
            </FormGroup>
            <h6 className="text-muted mt-4 or">{SignUpWith}</h6>
            <div className="social mt-4">
              <div className="btn-showcase">
                <a className="btn btn-light" href="https://www.linkedin.com/login" target="_blank" rel="noreferrer">
                  <Linkedin className="txt-linkedin" />{linkedInHeading}
                </a>
                <a className="btn btn-light" href="https://twitter.com/login?lang=en" target="_blank" rel="noreferrer">
                  <Twitter className="txt-twitter" />{TwitterHeading}
                </a>
                <a className="btn btn-light" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                  <Facebook className="txt-fb" />{FacebookHeading}
                </a>
              </div>
            </div>
            <p className="mt-4 mb-0">{HaveAccount}<Link className="ms-2" href="/authentication/login">{SignIn}</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommonRegisterForm;
