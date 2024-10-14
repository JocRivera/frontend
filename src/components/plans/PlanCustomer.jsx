import React, { useState } from 'react';
import { Card, Row, Col, Container, Badge, Button, Form, FormControl } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

export default function PlanCustomer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const plansPerPage = 3;

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
            accommodations: ["No incluye alojamientos"],
        }
    ];

    const filteredPlans = plans.filter((plan) =>
        Object.values(plan).some(
            (field) => typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const pageCount = Math.ceil(filteredPlans.length / plansPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * plansPerPage;
    const currentPlans = filteredPlans.slice(offset, offset + plansPerPage);

    const handleSearch = (e) => {
        e.preventDefault();
        // La búsqueda se realiza en tiempo real, así que no es necesario hacer nada aquí
    };

    return (
        <Container className="py-5">
            <h1 className="text-center mb-5">Planes</h1>
            <div className="d-flex justify-content-between align-items-center mb-2">
            <Form className="d-flex mb-3" onSubmit={handleSearch}>
                <FormControl
                    type="search"
                    placeholder="Buscar planes..."
                    className="me-2"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-success" type="submit">
                    Buscar
                </Button>
            </Form>
            </div>
            <Row>
                {currentPlans.map((plan) => (
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
            <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination-container"}
                activeClassName={"active"}
            />
        </Container>
    );
}