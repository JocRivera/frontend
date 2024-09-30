import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaLock, FaUnlock } from 'react-icons/fa';

const ProfilePage = () => {
  const { isAuthenticated, user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [document, setDocument] = useState(user?.document || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});

  // Estados para la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para el tipo de documento
  const [documentType, setDocumentType] = useState(user?.documentType || '');
  const documentTypeOptions = [
    { value: 'C.C', label: 'Cédula de Ciudadanía' },
    { value: 'C.E', label: 'Cédula de Extranjería' },
    { value: 'P.A', label: 'Pasaporte' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      setDocument(user?.document || '');
      setName(user?.name || '');
      setEmail(user?.email || '');
      setBirthdate(user?.birthdate || '');
      setDocumentType(user?.documentType || '');
    }
  }, [isAuthenticated, navigate, user]);

  const validateField = (field, value) => {
    const errorMessages = {
      fullName: 'El nombre debe tener al menos 8 caracteres.',
      idNumber: 'El número de identificación debe tener al menos 4 dígitos y no contener letras.',
      email: 'Por favor, ingrese un email válido.',
      birthdate: 'Debes tener al menos 18 años para registrarte.',
      password: 'La contraseña debe contener al menos 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      confirmPassword: 'Las contraseñas no coinciden.',
      documentType: 'Debe seleccionar un tipo de documento.',
    };

    const validations = {
      fullName: value.length >= 8,
      idNumber: /^[0-9]{4,}$/.test(value),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      birthdate: value && new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{10,}$/.test(value),
      confirmPassword: value === password,
      documentType: value !== '',
    };

    return validations[field] ? '' : errorMessages[field];
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {
      fullName: validateField('fullName', name),
      idNumber: validateField('idNumber', document),
      email: validateField('email', email),
      birthdate: validateField('birthdate', birthdate),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
      documentType: validateField('documentType', documentType),
    };
  
    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }
  
    setSuccess('Perfil actualizado correctamente.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    setDocument(user?.document || '');
    setName(user?.name || '');
    setEmail(user?.email || '');
    setBirthdate(user?.birthdate || '');
    setPassword('');
    setConfirmPassword('');
    setDocumentType(user?.documentType || '');
    setErrors({});
    setSuccess('');
    setTouched({});

    window.history.back();
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else if (type === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Función para renderizar el campo de contraseña con diferentes estilos
  const renderPasswordField = (fieldName, placeholder, value, onChange, onBlur, error, touched, showPassword, toggleVisibility, style) => {
    switch(style) {
      case 'minimal':
        return (
          <Form.Group className="mb-3" controlId={`formBasic${fieldName}`}>
            <Form.Label>{fieldName === 'Password' ? 'Contraseña' : 'Confirmar Contraseña'}</Form.Label>
            <div style={{ position: 'relative', maxWidth: '80%' }}>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isInvalid={!!error && touched}
                style={{ paddingRight: '40px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
                onClick={toggleVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        );

      case 'boxed':
        return (
          <Form.Group className="mb-3" controlId={`formBasic${fieldName}`}>
            <Form.Label>{fieldName === 'Password' ? 'Contraseña' : 'Confirmar Contraseña'}</Form.Label>
            <div style={{ position: 'relative', maxWidth: '80%' }}>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isInvalid={!!error && touched}
                style={{ paddingRight: '40px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '5px',
                  transform: 'translateY(-50%)',
                  background: '#f8f9fa',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                }}
                onClick={toggleVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        );

      case 'integrated':
        return (
          <Form.Group className="mb-3" controlId={`formBasic${fieldName}`}>
            <Form.Label>{fieldName === 'Password' ? 'Contraseña' : 'Confirmar Contraseña'}</Form.Label>
            <InputGroup style={{ maxWidth: '80%' }}>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isInvalid={!!error && touched}
              />
              <InputGroup.Text 
                onClick={toggleVisibility}
                style={{ cursor: 'pointer', background: showPassword ? '#e9ecef' : '#ffffff' }}
              >
                {showPassword ? <FaUnlock /> : <FaLock />}
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight: "850px" }}>
      <h1>Editar Perfil</h1>
      <div className='row'>
        {errors.global && <Alert variant="danger">{errors.global}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicDocument">
                <Form.Label>Número de Documento</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingresa tu número de documento"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  onBlur={() => handleBlur('idNumber', document)}
                  isInvalid={!!errors.idNumber && touched.idNumber}
                  style={{ maxWidth: '80%' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.idNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('fullName', name)}
                  isInvalid={!!errors.fullName && touched.fullName}
                  style={{ maxWidth: '80%' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDocumentType" style={{ maxWidth: '80%' }}>
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  onBlur={() => handleBlur('documentType', documentType)}
                  isInvalid={!!errors.documentType && touched.documentType}
                >
                  <option value="">Seleccione un tipo de documento</option>
                  {documentTypeOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.documentType}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Minimal style password field */}
              {renderPasswordField(
                'Password',
                'Password',
                password,
                (e) => setPassword(e.target.value),
                () => handleBlur('confirmPassword', password),
                errors.password,
                touched.password,
                showPassword,
                () => togglePasswordVisibility('password'),
                'boxed'
              )}
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email', email)}
                  isInvalid={!!errors.email && touched.email}
                  style={{ maxWidth: '80%' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicBirthdate">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Ingresa tu fecha de nacimiento"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  onBlur={() => handleBlur('birthdate', birthdate)}
                  isInvalid={!!errors.birthdate && touched.birthdate}
                  style={{ maxWidth: '80%' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.birthdate}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Boxed style confirm password field */}
              {renderPasswordField(
                'ConfirmPassword',
                'Confirma tu contraseña',
                confirmPassword,
                (e) => setConfirmPassword(e.target.value),
                () => handleBlur('confirmPassword', confirmPassword),
                errors.confirmPassword,
                touched.confirmPassword,
                showConfirmPassword,
                () => togglePasswordVisibility('confirmPassword'),
                'boxed'
              )}

              {/* Integrated style password field (optional, for demonstration) */}
            
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
          <Button
          variant="secondary"
            type="button"
            onClick={handleCancel}
            className="ml-2"
          >
            Cancelar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
