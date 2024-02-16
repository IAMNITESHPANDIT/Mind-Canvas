import { BsGithub } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import "../../styles/footer.style.scss";
const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center footer">
      <div className="flex justify-between items-center defaultpadding">
        <div className="text-sm copyright">&copy; Nitesh Kumar Pandey</div>
        <div className="links">
          <a
            href="https://github.com/iamniteshpandit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub alt="GitHub" className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/iamniteshpandit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillLinkedin alt="LinkedIn" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;