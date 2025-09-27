import { FaAsterisk } from 'react-icons/fa';

const RequiredFieldIndicator = ({ className = "text-danger ms-1" }) => {
  return (
    <FaAsterisk 
      className={className} 
      style={{ fontSize: '0.5rem' }}
      title="Required field"
    />
  );
};

export default RequiredFieldIndicator;