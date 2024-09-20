import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Info, X, MapPin, Users, Coffee, Sunrise, Sunset, BedDouble, Home, BookOpen, User, Menu } from 'lucide-react'

const mockReservations = [
    { id: 1, planName: "Romantic Getaway", clientName: "John Doe", status: "confirmed", date: "2023-07-15", checkIn: "2023-08-01", checkOut: "2023-08-03", location: "Seaside Suite", guests: 2, amenities: ["Champagne", "Spa Treatment", "Candlelit Dinner"] },
    { id: 2, planName: "Family Fun", clientName: "Jane Smith", status: "pending", date: "2023-07-16", checkIn: "2023-08-10", checkOut: "2023-08-15", location: "Garden Villa", guests: 4, amenities: ["Kids Club", "Pool Access", "Game Room"] },
    { id: 3, planName: "Adventure Package", clientName: "Mike Johnson", status: "cancelled", date: "2023-07-10", checkIn: "2023-07-20", checkOut: "2023-07-23", location: "Mountain Cabin", guests: 2, amenities: ["Hiking Gear", "Kayak Rental", "Guided Tour"] },
    { id: 4, planName: "Relaxation Retreat", clientName: "Emily Brown", status: "confirmed", date: "2023-07-18", checkIn: "2023-09-05", checkOut: "2023-09-10", location: "Zen Garden Room", guests: 1, amenities: ["Daily Yoga", "Meditation Sessions", "Spa Access"] },
]

const getStatusColor = (status) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}
export default function Myreservations() {
    const [reservations, setReservations] = useState(mockReservations)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const router = useRouter()

    const handleCancelReservation = (id) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, status: 'cancelled' } : res
        ))
    }
    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center mb-8">My Magical Getaways</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <CardHeader className={`${getStatusColor(reservation.status)} p-4`}>
                            <CardTitle className="flex justify-between items-center">
                                <span>{reservation.planName}</span>
                                <Badge variant={reservation.status}>{reservation.status}</Badge>
                            </CardTitle>
                            <CardDescription className="text-sm opacity-75">
                                Booked on {reservation.date}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{reservation.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{reservation.guests} guests</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-1">
                                    <Sunrise className="w-4 h-4" />
                                    <span className="text-sm">{reservation.checkIn}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Sunset className="w-4 h-4" />
                                    <span className="text-sm">{reservation.checkOut}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {reservation.amenities.map((amenity, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        <Coffee className="w-3 h-3 mr-1" />
                                        {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-gray-50 flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                                <Info className="w-4 h-4 mr-1" /> Details
                            </Button>
                            {reservation.status !== 'cancelled' && (
                                <Button variant="destructive" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                                    <X className="w-4 h-4 mr-1" /> Cancel
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <Button onClick={() => router.push('/plans')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CalendarDays className="w-4 h-4 mr-2" /> Book a New Adventure
                </Button>
            </div>

            <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reservation Details</DialogTitle>
                        <DialogDescription>
                            Your magical stay at {selectedReservation?.location}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">{selectedReservation.planName}</h4>
                                <Badge variant={selectedReservation.status}>{selectedReservation.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Check-in</p>
                                    <p className="font-medium">{selectedReservation.checkIn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Check-out</p>
                                    <p className="font-medium">{selectedReservation.checkOut}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Guests</p>
                                <p className="font-medium">{selectedReservation.guests}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amenities</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedReservation.amenities.map((amenity, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Booked on</p>
                                <p className="font-medium">{selectedReservation.date}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
