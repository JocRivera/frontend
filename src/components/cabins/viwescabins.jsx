import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import "./Cabins.css";

// Simulación de datos de cabañas (en un entorno real, estos datos provendrían de una API)
const initialCabanaList = [
  {
    id: 1,
    nombre: "Cabaña 1",
    capacidad: 4,
    estado: "En servicio",
    descripcion: "Descripción de la cabaña 1",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }],
    imagen: '/src/assets/316019033.jpg',
  },
  {
    id: 2,
    nombre: "Cabaña 2",
    capacidad: 5,
    estado: "En servicio",
    descripcion: "Descripción de la cabaña 2",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }, { articulos: "Wi-Fi" }],
    imagen: '/src/assets/DSC_6823-600x400-1.jpg',
  },
  {
    id: 3,
    nombre: "Cabaña 3",
    capacidad: 5,
    estado: "En servicio",
    descripcion: "Descripción de la cabaña 2",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }, { articulos: "Wi-Fi" }],
    imagen: '/src/assets/cabanas-rusticas-el-viejo-tambo-medellin-antioquia.jpg',
  },
  // Agrega más cabañas según sea necesario
];

const Listcabins = () => {
  const [cabanaList, setCabanaList] = useState(initialCabanaList);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Aquí puedes agregar lógica para obtener datos de una API si es necesario
  }, []);

  const filteredCabanaList = cabanaList.filter((cabana) =>
    cabana.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="container" style={{ minHeight: "100vh", paddingTop: "60px", paddingLeft: 0, paddingRight: 0 }}>
      <h1 className="text-center mb-4">Lista de Cabañas</h1>
      <div
        className="d-flex justify-content-start align-items-center mb-2"
        style={{ gap: "750px", paddingLeft: 0, paddingRight: 0 }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2 form-control"
          style={{ maxWidth: "300px", marginRight: "20px" }}
        />
      </div>

      <Row className="justify-content-center mx-0">
        {filteredCabanaList.length > 0 ? (
          filteredCabanaList.map((cabana) => (
            <Col md={4} key={cabana.id} className="mb-3 px-0">
              <Card className="shadow-sm border-0 hover-card">
                {cabana.imagen && (
                  <Card.Img
                    variant="top"
                    src={cabana.imagen}
                    style={{
                      height: "200px", // Ajusta el alto según tus necesidades
                      objectFit: "cover", // Ajusta la imagen para que se vea completa
                      width: "100%", // Ajusta el ancho según tus necesidades
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="fw-bold">{cabana.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Comodidades:</strong> {cabana.comodidades.map((c) => c.articulos).join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacidad:</strong> {cabana.capacidad}
                  </Card.Text>
                  <Card.Text>
                    <strong>Estado:</strong> {cabana.estado}
                  </Card.Text>
                  <Card.Text>
                    <strong>Descripción:</strong> {cabana.descripcion}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron cabañas.</p>
        )}
      </Row>
    </Container>
  );
};

export default Listcabins;