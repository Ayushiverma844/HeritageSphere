import React from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-2 border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 py-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}

          <div>
            <div className="flex items-center gap-3 ">
              <div className="h-10 w-10 rounded-xl bg-heritage-gold/10 flex items-center justify-center">
                <Landmark
                  size={22}
                  className="text-heritage-gold"
                />
              </div>

              <h2 className="text-xl font-bold text-white">
                HeritageSphere
              </h2>
            </div>

            <p className="text-gray-400 text-sm mt-4 leading-5">
              Discover India's rich cultural heritage,
              historical places and timeless stories.
            </p>
          </div>

          {/* Explore */}

          <div >
            <h3 className="text-white font-semibold mb-4">
              Explore
            </h3>

            <FooterLink text="Home" path="/" />
            <FooterLink
              text="Heritage Places"
              path="/places"
            />
            <FooterLink
              text="Stories"
              path="/stories"
            />
            <FooterLink
              text="Saved"
              path="/my-collection"
            />
          </div>

          {/* Social Links */}

          <div>
  <h3 className="text-white font-semibold mb-4">
    Connect with us
  </h3>

  <div className="flex gap-4">
    <Social icon={<FaFacebook size={17} />} />
    <Social icon={<FaInstagram size={17} />} />
    <Social icon={<FaTwitter size={17} />} />
  </div>
</div>

          {/* Contact */}

          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="text-heritage-gold"
                />
                <span>support@heritagesphere.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="text-heritage-gold"
                />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin
                  size={17}
                  className="text-heritage-gold"
                />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-6 pt-3 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} HeritageSphere.
            All rights reserved.
          </p>

          <p>Preserving Culture • Sharing Stories</p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text, path }) => {
  return (
    <Link
      to={path}
      className="flex items-center gap-2 mb-1 text-sm text-gray-400 hover:text-heritage-gold transition-all duration-300"
    >
      <ArrowRight size={13} />
      {text}
    </Link>
  );
};

const Social = ({ icon }) => {
  return (
    <button
      className="
      h-8
      w-8
      rounded-lg
      bg-white/5
      border
      border-white/10
      flex
      items-center
      justify-center
      text-gray-400
      hover:text-heritage-gold
      hover:border-heritage-gold
      transition-all
      duration-300
      "
    >
      {icon}
    </button>
  );
};

export default Footer;