
const AuthModal = ({ onClose, onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(username, password);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Login Required</h2>
        <p>Please enter your credentials to continue with the purchase</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login & Continue</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
