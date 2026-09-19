import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle
} from "react-leaflet";

import L from "leaflet";

import type { NearbyUser } from "../../services/MapService";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./UserMap.css";

interface UserMapProps {
    latitude: number;
    longitude: number;
    searchRadiusKm: number;
    nearbyUsers: NearbyUser[];
    city?: string | null;
    province?: string | null;
}

const userIcon = L.divIcon({
    className: "adytum-user-marker",

    html: `
        <div class="adytum-marker-inner">
            ✦
        </div>
    `,

    iconSize: [38, 38],

    iconAnchor: [19, 19],

    popupAnchor: [0, -22]
});

const nearbyUserIcon = L.divIcon({
    className: "adytum-nearby-marker",

    html: `
        <div class="adytum-nearby-marker-inner">
            ◆
        </div>
    `,

    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
});


function UserMap({
    latitude,
    longitude,
    searchRadiusKm,
    nearbyUsers,
    city,
    province
}: UserMapProps) {

    const navigate = useNavigate();

    return (

        <MapContainer
            center={[
                latitude,
                longitude
            ]}
            zoom={12}
            scrollWheelZoom={true}
            className="user-map"
        >

            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                position={[
                    latitude,
                    longitude
                ]}
                icon={userIcon}
            >

                <Popup>

                    <strong>
                        La tua posizione
                    </strong>

                    <br />

                    {city}
                    {city && province ? ", " : ""}
                    {province}

                </Popup>

            </Marker>

            {nearbyUsers.map((user) => (

                <Marker
                    key={user.userId}
                    position={[
                        user.latitude,
                        user.longitude
                    ]}
                    icon={nearbyUserIcon}
                >

                    <Popup>

                        <div className="adytum-map-popup">

                            <strong>
                                {user.displayName}
                            </strong>

                            <p>
                                {user.availableBooksCount === 1
                                    ? "1 libro disponibile"
                                    : `${user.availableBooksCount} libri disponibili`
                                }
                            </p>

                            <p>
                                {user.distanceKm === 0
                                    ? "Nella tua zona"
                                    : `${user.distanceKm} km`
                                }
                            </p>

                            {user.city && (
                                <span>
                                    {user.city}
                                    {user.province
                                        ? ` (${user.province})`
                                        : ""}
                                </span>
                            )}

                            <button
                                type="button"
                                className="map-profile-button"
                                onClick={() =>
                                    navigate(`/users/${user.userId}`)
                                }
                            >
                                Vedi profilo
                            </button>

                        </div>

                    </Popup>

                </Marker>
            ))}

            <Circle
            // Il cerchio rappresenta graficamente il raggio configurato per la ricerca di utenti nelle vicinanze. 
            // Leaflet richiede il raggio configurato in metri.
                center={[
                    latitude,
                    longitude
                ]}
                radius={searchRadiusKm * 1000}
                pathOptions={{
                    color: "#b9985f",
                    weight: 1.5,
                    fillColor: "#7a241f",
                    fillOpacity: 0.12
                }}
            />

        </MapContainer>

    );
}

export default UserMap;