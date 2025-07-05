import React, { useState } from 'react';
import './App.css';

function App() {
  // Adım state'i: 0=register, 1=login, 2=otp, 3=payment, 4=result
  const [step, setStep] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [token, setToken] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
  });
  const [merchantInfo, setMerchantInfo] = useState({
    program_id: 1,
    name: '',
    company: '',
    email: '',
    phone: '',
    web: '',
    country: 'TR',
    lang: 'tr_TR'
  });
  // Sepet ve ödeme state
  const [showCartModal, setShowCartModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', price: '', quantity: 1 });

  // Fatura ve alıcı bilgileri (default değerlerle başlat)
  const [invoiceInfo, setInvoiceInfo] = useState({
    id: 'cart_hash_123',
    first_name: 'John',
    last_name: 'Doe',
    price: '100.00',
    quantity: 1
  });
  const [payerInfo, setPayerInfo] = useState({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '5000000000',
    address: {
      line_1: '123 Main St',
      city: 'Istanbul',
      state: 'Istanbul',
      postal_code: '07050',
      country: 'TR'
    },
    ip: '127.0.0.1'
  });

  // Sepet default değerleri
  const [cart, setCart] = useState([
   
  ]);

  // Sepet toplamı (discount tipinde ürünler çıkarılır)
  const cartTotal = cart.reduce((sum, item) => {
    if (item.type === 'discount') {
      return sum - (parseFloat(item.price) * item.quantity);
    }
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  // Sepete ürün ekleme fonksiyonu
  const addProductToCart = (product) => {
    setCart([...cart, product]);
  };

  // Sepetten ürün silme fonksiyonu
  const removeProductFromCart = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  // Register Form
  const RegisterForm = ({ onSuccess }) => {
    const [form, setForm] = useState({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      merchant_name: '',
      merchant_company: '',
      merchant_web: '',
      merchant_country: 'TR'
    });
    const [error, setError] = useState('');
    return (
      <div className="form-box">
        <h2>Kayıt Ol</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            try {
              const res = await fetch('https://api.paythor.com/auth/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user: {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    phone: form.phone,
                    email: form.email,
                    password: form.password
                  },
                  merchant: {
                    program_id: 1,
                    name: form.merchant_name,
                    company: form.merchant_company,
                    email: form.email,
                    phone: form.phone,
                    web: form.merchant_web,
                    country: form.merchant_country,
                    lang: 'tr_TR'
                  }
                })
              });
              const data = await res.json();
              if (data.status === 'success') {
                setUserEmail(form.email);
                setUserPassword(form.password);
                onSuccess();
              } else {
                setError(data.details?.join(', ') || data.message);
              }
            } catch (err) {
              setError('Kayıt başarısız.');
            }
          }}
        >
          <input
            className="register-input"
            type="text"
            placeholder="Ad"
            required
            autoComplete="given-name"
            value={form.firstname}
            onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Soyad"
            required
            autoComplete="family-name"
            value={form.lastname}
            onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))}
          />
          <input
            className="register-input"
            type="email"
            placeholder="E-posta"
            required
            autoComplete="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="register-input"
            type="tel"
            inputMode="tel"
            pattern="[0-9]*"
            placeholder="Telefon"
            required
            autoComplete="off"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
          <input
            className="register-input"
            type="password"
            placeholder="Şifre"
            required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Mağaza Adı"
            required
            value={form.merchant_name}
            onChange={e => setForm(f => ({ ...f, merchant_name: e.target.value }))}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Şirket Adı"
            required
            value={form.merchant_company}
            onChange={e => setForm(f => ({ ...f, merchant_company: e.target.value }))}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Web Sitesi"
            value={form.merchant_web}
            onChange={e => setForm(f => ({ ...f, merchant_web: e.target.value }))}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Ülke"
            value={form.merchant_country}
            onChange={e => setForm(f => ({ ...f, merchant_country: e.target.value }))}
          />
          <button type="submit">Kayıt Ol</button>
          {error && <div className="error">{error}</div>}
        </form>
        <button className="switch-btn" onClick={() => setStep(1)}>Zaten hesabım var</button>
      </div>
    );
  };

  // Login Form
  const LoginForm = ({ onSuccess }) => {
    const [form, setForm] = useState({ email: userEmail, password: userPassword });
    const [error, setError] = useState('');
    return (
      <div className="form-box">
        <h2>Giriş Yap</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            try {
              // Paythor docs'a uygun şekilde auth_method: "email_password" kullanılmalı!
              const body = {
                auth_query: {
                  auth_method: "email_password_panel",
                  email: form.email,
                  password: form.password,
                  program_id: 1,
                  app_id: 102,
                  store_url: ""
                }
              };
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                redirect: "follow"
              };
              const res = await fetch('https://api.paythor.com/auth/signin', requestOptions);
              const data = await res.json();
              if (data.status === 'success' && data.data && data.data.token_string) {
                setOtpToken(data.data.token_string);
                setUserEmail(form.email);
                setUserPassword(form.password);
                onSuccess();
              } else {
                setError(data.details?.join(', ') || data.message);
              }
            } catch (err) {
              setError('Giriş başarısız.');
            }
          }}
        >
          <input
            className="login-email-input"
            placeholder="E-posta"
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="login-password-input"
            placeholder="Şifre"
            required
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <button type="submit">Giriş Yap</button>
          {error && <div className="error">{error}</div>}
        </form>
        <button className="switch-btn" onClick={() => setStep(0)}>Kayıt Ol</button>
      </div>
    );
  };

  // OTP Form
  const OtpForm = ({ onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    return (
      <div className="form-box">
        <h2>OTP Doğrulama</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            try {
              const res = await fetch('https://api.paythor.com/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  target: userEmail,
                  otp
                })
              });
              const data = await res.json();
              if (data.status === 'success') {
                setToken(otpToken);
                onSuccess();
              } else {
                setError(data.message);
              }
            } catch (err) {
              setError('OTP doğrulama başarısız.');
            }
          }}
        >
          <input
            className="otp-input"
            placeholder="OTP Kodu"
            required
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button type="submit">Doğrula</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
  };

  // Sepet Modalı
  const CartModal = () => (
    <div className="modal-bg">
      <div className="modal">
        <h3>Ürün Ekle</h3>
        <form
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            if (!newProduct.id || !newProduct.name || !newProduct.price) return;
            addProductToCart({
              ...newProduct,
              type: 'product',
              price: parseFloat(newProduct.price).toFixed(2),
              quantity: parseInt(newProduct.quantity)
            });
            setNewProduct({ id: '', name: '', price: '', quantity: 1 });
            setShowCartModal(false);
          }}>
          <input
            className="cart-id-input"
            autoComplete="off"
            placeholder="Ürün ID"
            required
            type="text"
            maxLength={20}
            value={newProduct.id}
            onChange={e => setNewProduct(prev => ({ ...prev, id: e.target.value }))}
          />
          <input
            className="cart-name-input"
            autoComplete="off"
            placeholder="Ürün Adı"
            required
            type="text"
            maxLength={20}
            value={newProduct.name}
            onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="cart-price-input"
            autoComplete="off"
            placeholder="Fiyat"
            required
            type="number"
            min="0"
            step="0.01"
            maxLength={20}
            inputMode="decimal"
            value={newProduct.price}
            onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
          />
          <input
            className="cart-qty-input"
            autoComplete="off"
            placeholder="Adet"
            required
            type="number"
            min="1"
            step="1"
            maxLength={20}
            inputMode="numeric"
            value={newProduct.quantity}
            onChange={e => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
          />
          <button type="submit" className="cart-modal-add-btn">Ekle</button>
        </form>
        <button onClick={() => setShowCartModal(false)}>Kapat</button>
      </div>
    </div>
  );

  // Payment Panel
  const PaymentPanel = ({ onSuccess }) => (
    <div>
      <h2>Ödeme Paneli</h2>
      <div className="payment-flow">
        {/* Fatura Kutusu */}
        <div className="payment-box">
          <h3>Fatura</h3>
          <input className="register-input payment-input" placeholder="Fatura ID" value={invoiceInfo.id} onChange={e => setInvoiceInfo({ ...invoiceInfo, id: e.target.value })} />
          <input className="register-input payment-input" placeholder="Ad" value={invoiceInfo.first_name} onChange={e => setInvoiceInfo({ ...invoiceInfo, first_name: e.target.value })} />
          <input className="register-input payment-input" placeholder="Soyad" value={invoiceInfo.last_name} onChange={e => setInvoiceInfo({ ...invoiceInfo, last_name: e.target.value })} />
          <input className="register-input payment-input" placeholder="Tutar" value={cartTotal.toFixed(2)} readOnly />
        </div>
        {/* Alıcı Kutusu */}
        <div className="payment-box">
          <h3>Alıcı</h3>
          <input className="register-input payment-input" placeholder="Ad" value={payerInfo.first_name} onChange={e => setPayerInfo({ ...payerInfo, first_name: e.target.value })} />
          <input className="register-input payment-input" placeholder="Soyad" value={payerInfo.last_name} onChange={e => setPayerInfo({ ...payerInfo, last_name: e.target.value })} />
          <input className="register-input payment-input" placeholder="E-posta" value={payerInfo.email} onChange={e => setPayerInfo({ ...payerInfo, email: e.target.value })} />
          <input className="register-input payment-input" type="tel" inputMode="tel" pattern="[0-9]*" autoComplete="off" placeholder="Telefon" value={payerInfo.phone} onChange={e => setPayerInfo({ ...payerInfo, phone: e.target.value })} />
          <input className="register-input payment-input" placeholder="Adres" value={payerInfo.address.line_1} onChange={e => setPayerInfo({ ...payerInfo, address: { ...payerInfo.address, line_1: e.target.value } })} />
          <input className="register-input payment-input" placeholder="Şehir" value={payerInfo.address.city} onChange={e => setPayerInfo({ ...payerInfo, address: { ...payerInfo.address, city: e.target.value } })} />
          <input className="register-input payment-input" placeholder="İlçe" value={payerInfo.address.state} onChange={e => setPayerInfo({ ...payerInfo, address: { ...payerInfo.address, state: e.target.value } })} />
          <input className="register-input payment-input" placeholder="Posta Kodu" value={payerInfo.address.postal_code} onChange={e => setPayerInfo({ ...payerInfo, address: { ...payerInfo.address, postal_code: e.target.value } })} />
        </div>
        {/* Sepet Kutusu */}
        <div className="payment-box cart-box-wide">
          <h3>Sepet</h3>
          <ul className="cart-list">
            {cart.map((item, idx) => (
              <li key={idx}>
                <span>
                  <span className={`cart-card-type ${item.type}`}>{item.type}</span>
                  <span className="cart-card-name">{item.name}</span>
                  <span className="cart-card-qty">({item.quantity} x <span className="cart-card-price">{item.price}₺</span>)</span>
                </span>
                {/* Sadece product tipinde ise silme butonu göster */}
                {item.type === 'product' && (
                  <button className="cart-remove-btn" onClick={() => removeProductFromCart(idx)}>×</button>
                )}
              </li>
            ))}
          </ul>
          <button className="add-btn" onClick={() => setShowCartModal(true)}>Ürün Ekle</button>
          <div className="total">Toplam: <b>{cartTotal.toFixed(2)}₺</b></div>
        </div>
      </div>
      {showCartModal && <CartModal />}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <button
          className="payment-create-btn"
          style={{ width: 160, fontSize: '1rem', padding: '8px 0', margin: 0 }}
          onClick={async () => {
            setPaymentError('');
            if (cart.length === 0) {
              setPaymentError('Sepet boş!');
              return;
            }
            try {
              if (!token) {
                setPaymentError('Ödeme için önce giriş yapıp OTP doğrulamalısınız.');
                return;
              }
              const myHeaders = new Headers();
              // Paythor API için Authorization header'ı "Bearer ${token}" formatında olmalı!
              myHeaders.append("Authorization", `Bearer ${token}`);
              myHeaders.append("Content-Type", "application/json");
              const raw = JSON.stringify({
                payment: {
                  amount: cartTotal.toFixed(2),
                  currency: "TRY",
                  buyer_fee: "0",
                  method: "creditcard",
                  merchant_reference: invoiceInfo.id || "ORDER-" + Math.floor(Math.random() * 100000)
                },
                payer: {
                  ...payerInfo,
                  ip: payerInfo.ip || "127.0.0.1"
                },
                order: {
                  cart: cart,
                  shipping: {
                    first_name: payerInfo.first_name,
                    last_name: payerInfo.last_name,
                    phone: payerInfo.phone,
                    email: payerInfo.email,
                    address: payerInfo.address
                  },
                  invoice: {
                    id: invoiceInfo.id || "cart_hash_" + Math.floor(Math.random() * 100000),
                    first_name: invoiceInfo.first_name,
                    last_name: invoiceInfo.last_name,
                    price: cartTotal.toFixed(2),
                    quantity: 1
                  }
                }
              });
              const res = await fetch("https://api.paythor.com/payment/create", {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
              });
              const data = await res.json();
              if (data.status === 'success' && data.data && data.data.payment_link) {
                setPaymentLink(data.data.payment_link);
                onSuccess();
              } else {
                setPaymentError(data.message || "Ödeme linki oluşturulamadı.");
              }
            } catch (err) {
              setPaymentError('Ödeme oluşturulamadı.');
            }
          }}
        >
          Ödeme Oluştur
        </button>
      </div>
      {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
    </div>
  );

  // QR kod için ek kütüphane olmadan basit bir <img> ile API'den alınabilir.
// (npm ile qrcode.react gibi bir paket de kullanılabilir ama burada dışa bağımlılık olmadan çözüm sunuyorum.)

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function shareLink(link) {
  if (navigator.share) {
    navigator.share({
      title: 'Paythor Ödeme Linki',
      text: 'Ödeme yapmak için bu linki kullanabilirsin:',
      url: link
    });
  }
}

function PaymentResult({ link }) {
  const [showShare, setShowShare] = useState(false);

  // Basit QR kod API'si (Google Chart API veya qrserver.com)
  const qrUrl = link
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}`
    : '';

  return (
    <div>
      <h2>Ödeme Linki</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a id="payment-url" href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(link)}
            title="Kopyala"
          >
            {/* Kopyala ikonu (Clipboard SVG) */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}>
              <rect x="6" y="2" width="9" height="14" rx="2" fill="#fff" stroke="#0077b6" strokeWidth="1.5"/>
              <rect x="3" y="5" width="9" height="13" rx="2" fill="#eafbe7" stroke="#bcdff1" strokeWidth="1.2"/>
            </svg>
            Copy
          </button>
          <button
            className="share-btn"
            onClick={() => setShowShare(s => !s)}
            title="Paylaş"
          >
            {/* Paylaş ikonu (Share SVG) */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}>
              <circle cx="15" cy="5" r="2.5" fill="#fff" stroke="#0077b6" strokeWidth="1.5"/>
              <circle cx="5" cy="10" r="2.5" fill="#fff" stroke="#0077b6" strokeWidth="1.5"/>
              <circle cx="15" cy="15" r="2.5" fill="#fff" stroke="#0077b6" strokeWidth="1.5"/>
              <line x1="7.2" y1="9.1" x2="12.8" y2="6.1" stroke="#0077b6" strokeWidth="1.2"/>
              <line x1="7.2" y1="10.9" x2="12.8" y2="13.9" stroke="#0077b6" strokeWidth="1.2"/>
            </svg>
            Share
          </button>
        </div>
        {showShare && (
          <div style={{
            display: 'flex',
            gap: 10,
            marginTop: 6,
            background: '#f8fafd',
            border: '1px solid #bcdff1',
            borderRadius: 8,
            padding: '10px 16px'
          }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
            >
              WhatsApp
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E1306C', fontWeight: 600, textDecoration: 'none' }}
            >
              Instagram
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1877F3', fontWeight: 600, textDecoration: 'none' }}
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1DA1F2', fontWeight: 600, textDecoration: 'none' }}
            >
              Twitter
            </a>
          </div>
        )}
        {link && (
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <img
              src={qrUrl}
              alt="QR Kod"
              style={{ borderRadius: 12, border: '1.5px solid #bcdff1', background: '#fff', padding: 6 }}
            />
            <div style={{ fontSize: 13, color: '#0077b6', marginTop: 6 }}>QR kodu okutarak ödemeye geçebilirsiniz.</div>
          </div>
        )}
      </div>
      <div>
        <button onClick={() => {
          setStep(3);
          setPaymentLink('');
        }}>Yeni Ödeme</button>
      </div>
    </div>
  );
}

// Main App render
return (
  <div className="App">
    {/* <h1>Paythor Demo Akışı</h1> */}
    {step === 0 && <RegisterForm onSuccess={() => setStep(1)} />}
    {step === 1 && <LoginForm onSuccess={() => setStep(2)} />}
    {step === 2 && <OtpForm onSuccess={() => setStep(3)} />}
    {step === 3 && <PaymentPanel onSuccess={() => setStep(4)} />}
    {step === 4 && <PaymentResult link={paymentLink} />}
  </div>
);
}

export default App;


