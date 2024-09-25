import React from 'react';
import { Card, Row, Col, Container, Badge, Button } from 'react-bootstrap';

const PlanList = () => {
  const plans = [
    {
      id: 1,
      name: "Plan Empresarial",
      endDate: "2023-12-31",
      image: "/src/assets/PlanEmpresa.jpg?height=200&width=300",
      price: 299.99,
      services: ["Desayuno incluido", "Acceso a piscina", "Wi-Fi gratis"],
      accommodations: ["Cabaña familiar", "Suite doble"],
    },
    {
      id: 2,
      name: "Plan Romántico",
      endDate: "2023-11-30",
      image: "/src/assets/RomanticPlan.jpg?height=200&width=300",
      price: 199.99,
      services: ["Cena a la luz de las velas", "Masaje para parejas", "Champagne de bienvenida"],
      accommodations: ["Suite de luna de miel"],
    },
    {
      id: 3,
      name: "Plan Día de sol",
      endDate: "2024-03-15",
      image: "/src/assets/planSol.jpg?height=200&width=300",
      price: 249.99,
      services: ["Excursión guiada", "Alquiler de bicicletas", "Picnic al aire libre"],
      accommodations: ["No incluye alojamiento"],
    }
  ];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Planes</h1>
      <Row>
        {plans.map((plan) => (
          <Col key={plan.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={plan.image} alt={plan.name} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{plan.name}</Card.Title>
                <Card.Text className="text-muted mb-2">
                  <small>
                    <i className="bi bi-calendar-event me-2"></i>
                    Disponible hasta: {new Date(plan.endDate).toLocaleDateString()}
                  </small>
                </Card.Text>
                <Card.Text className="fs-4 fw-bold mb-3">${plan.price.toFixed(2)}</Card.Text>
                <Card.Text>
                  <strong>
                    <i className="bi bi-cup-hot me-2"></i>
                    Servicios:
                  </strong>
                </Card.Text>
                <ul className="list-unstyled">
                  {plan.services.map((service, index) => (
                    <li key={index}><i className="bi bi-check-circle-fill text-success me-2"></i>{service}</li>
                  ))}
                </ul>
                <Card.Text className="mt-3">
                  <strong>
                    <i className="bi bi-house-door me-2"></i>
                    Alojamientos:
                  </strong>
                </Card.Text>
                <div>
                  {plan.accommodations.map((accommodation, index) => (
                    <Badge key={index} bg="secondary" className="me-2 mb-2">{accommodation}</Badge>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0">
                <Button variant="primary" className="w-100">Reservar ahora</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PlanList;