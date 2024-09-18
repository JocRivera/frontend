import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";

// Simulación de datos de habitaciones (en un entorno real, estos datos provendrían de una API)
const initialRoomList = [
  {
    id: 1,
    nombre: "Habitación 1",
    capacidad: 2,
    estado: "En servicio",
    descripcion: "Descripción de la habitación 1",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }],
    imagen: '/src/assets/Imagen-de-WhatsApp-2023-11-28-a-las-15.06.35_81fc0fd1-1536x864.jpg',
  },
  {
    id: 2,
    nombre: "Habitación 2",
    capacidad: 3,
    estado: "En servicio",
    descripcion: "Descripción de la habitación 2",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }, { articulos: "Wi-Fi" }],
    imagen: '/src/assets/dsc-6279_00000000_5a699724_240109125620_1280x794.jpg',
  },
  {
    id: 3,
    nombre: "Habitación 3",
    capacidad: 4,
    estado: "En servicio",
    descripcion: "Descripción de la habitación 3",
    comodidades: [{ articulos: "TV" }, { articulos: "Aire acondicionado" }, { articulos: "Wi-Fi" }],
    imagen: '/src/assets/Imagen10-1.jpg',
  },
  // Agrega más habitaciones según sea necesario
];

const Listrooms = () => {
  const [roomList, setRoomList] = useState(initialRoomList);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Aquí puedes agregar lógica para obtener datos de una API si es necesario
  }, []);

  const filteredRoomList = roomList.filter((room) =>
    room.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ minHeight: "100vh", paddingTop: "60px" }}>
      <h1>Lista de Habitaciones</h1>
      <div
        className="d-flex justify-content-start align-items-center mb-2"
        style={{ gap: "750px" }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
          style={{ maxWidth: "300px", marginRight: "20px" }}
        />
      </div>

      <Row>
        {filteredRoomList.length > 0 ? (
          filteredRoomList.map((room) => (
            <Col md={4} key={room.id} className="mb-3">
              <Card>
                {room.imagen && (
                  <Card.Img
                    variant="top"
                    src={room.imagen}
                    style={{
                      height: "200px", // Ajusta el alto según tus necesidades
                      objectFit: "cover", // Ajusta la imagen para que se vea completa
                      width: "100%", // Ajusta el ancho según tus necesidades
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{room.nombre}</Card.Title>
                  <Card.Text>
                    Comodidades:{" "}
                    {room.comodidades.map((c) => c.articulos).join(", ")}
                  </Card.Text>
                  <Card.Text>Capacidad: {room.capacidad}</Card.Text>
                  <Card.Text>Estado: {room.estado}</Card.Text>
                  <Card.Text>Descripción: {room.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron habitaciones.</p>
        )}
      </Row>
    </div>
  );
};

export default Listrooms;