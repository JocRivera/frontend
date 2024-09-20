import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card, Modal, Row } from 'react-bootstrap';
import { CalendarDays, Info, X, MapPin, Users, Coffee, Sunrise, Sunset } from 'lucide-react';

const mockReservations = [
    { id: 1, planName: "Romantic Getaway", clientName: "John Doe", status: "confirmed", date: "2023-07-15", checkIn: "2023-08-01", checkOut: "2023-08-03", location: "Seaside Suite", guests: 2, amenities: ["Champagne", "Spa Treatment", "Candlelit Dinner"] },
    { id: 2, planName: "Family Fun", clientName: "Jane Smith", status: "pending", date: "2023-07-16", checkIn: "2023-08-10", checkOut: "2023-08-15", location: "Garden Villa", guests: 4, amenities: ["Kids Club", "Pool Access", "Game Room"] },
    { id: 3, planName: "Adventure Package", clientName: "Mike Johnson", status: "cancelled", date: "2023-07-10", checkIn: "2023-07-20", checkOut: "2023-07-23", location: "Mountain Cabin", guests: 2, amenities: ["Hiking Gear", "Kayak Rental", "Guided Tour"] },
    { id: 4, planName: "Relaxation Retreat", clientName: "Emily Brown", status: "confirmed", date: "2023-07-18", checkIn: "2023-09-05", checkOut: "2023-09-10", location: "Zen Garden Room", guests: 1, amenities: ["Daily Yoga", "Meditation Sessions", "Spa Access"] },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
};

export default function MyReservations() {
    const [reservations, setReservations] = useState(mockReservations);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancelReservation = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, status: 'cancelled' } : res
        ));
    };

    const handleShowModal = (reservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReservation(null);
    };

    return (
        <div className="container" style={{ minHeight: "100vh", paddingTop: "60px" }}>
            <h1 className="text-center mb-4">My Magical Getaways</h1>
            <Row>
                {reservations.map((reservation) => (
                    <div className="col-md-4 mb-4" key={reservation.id}>
                        <Card className="shadow-sm">
                            <Card.Header className={`bg-${getStatusColor(reservation.status)}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>{reservation.planName}</span>
                                    <Badge bg={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                                </div>
                                <small>Booked on {reservation.date}</small>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-2">
                                    <MapPin className="me-1" /> {reservation.location}
                                </div>
                                <div className="mb-2">
                                    <Users className="me-1" /> {reservation.guests} guests
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <div><Sunrise className="me-1" /> {reservation.checkIn}</div>
                                    <div><Sunset className="me-1" /> {reservation.checkOut}</div>
                                </div>
                                <div className="d-flex flex-wrap">
                                    {reservation.amenities.map((amenity, index) => (
                                        <Badge key={index} bg="light" className="me-1">
                                            <Coffee className="me-1" /> {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                <Button variant="info" size="sm" onClick={() => handleShowModal(reservation)}>
                                    <Info className="me-1" /> Details
                                </Button>
                                {reservation.status !== 'cancelled' && (
                                    <Button variant="danger" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                                        <X className="me-1" /> Cancel
                                    </Button>
                                )}
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
            </Row>

            <div className="text-center mt-4">
                <Link to="/viewsplans">
                    <Button className="btn btn-primary">
                        <CalendarDays className="me-2" /> Book a New Adventure
                    </Button>
                </Link>
            </div>


            <Modal show={isModalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <div>
                            <h4>{selectedReservation.planName}</h4>
                            <p><strong>Location:</strong> {selectedReservation.location}</p>
                            <p><strong>Check-in:</strong> {selectedReservation.checkIn}</p>
                            <p><strong>Check-out:</strong> {selectedReservation.checkOut}</p>
                            <p><strong>Guests:</strong> {selectedReservation.guests}</p>
                            <p><strong>Amenities:</strong> {selectedReservation.amenities.join(', ')}</p>
                            <p><strong>Booked on:</strong> {selectedReservation.date}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
