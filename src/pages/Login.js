import { useRef, useState, FormEvent } from 'react';
import { useBearImages } from '../hooks/useBearImages';
import { useBearAnimation } from '../hooks/useBearAnimation';
import BearAvatar from '../components/BearAvatar';
import Input from '../components/Input';
import EyeOn from '../assets/icons/eye_on.svg';
import EyeOff from '../assets/icons/eye_off.svg';
import '../styles/Login.css';

export default function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { watchBearImages, hideBearImages, peakBearImages } = useBearImages();

  const {
    currentBearImage,
    setCurrentFocus,
    currentFocus,
    isAnimating,
  } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    peakBearImages,
    emailLength: values.email.length,
    showPassword,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đăng nhập thành công!');
  };

  const togglePassword = () => {
    if (!isAnimating) setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const [localPart, domainPart] = value.split('@');

      if (localPart?.length > 64 || domainPart?.length > 50) return;
    }

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="bear-container">
          {currentBearImage && (
            <BearAvatar
              currentImage={currentBearImage}
              key={`${currentFocus}-${values.email.length}`}
            />
          )}
        </div>

        <Input
          placeholder="Email"
          name="email"
          type="email"
          ref={emailRef}
          autoFocus
          onFocus={() => setCurrentFocus('EMAIL')}
          autoComplete="email"
          value={values.email}
          onChange={handleInputChange}
        />

        <div className="password-container">
          <input
            placeholder="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            ref={passwordRef}
            onFocus={() => setCurrentFocus('PASSWORD')}
            autoComplete="current-password"
            value={values.password}
            onChange={handleInputChange}
            className="form-input input-with-icon"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="toggle-button"
          >
            <img
              src={showPassword ? EyeOff : EyeOn}
              alt="Toggle"
              className="toggle-icon"
            />
          </button>
        </div>

        <button type="submit" className="login-submit-btn">
          Log In
        </button>
      </form>
    </div>
  );
}
