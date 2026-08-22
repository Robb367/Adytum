import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth }
    from "../../contexts/AuthContext";

import {
    getPublicUserProfile,
    type PublicUserProfile
} from "../../services/UserService";

import { getImageUrl }
    from "../../utils/imageUrl";

import "./PublicProfilePage.css";


function PublicProfilePage() {

    const { userId } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();


    const [profile, setProfile] =
        useState<PublicUserProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadProfile() {

            if (!token || !userId) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const data =
                    await getPublicUserProfile(
                        Number(userId),
                        token
                    );

                setProfile(data);

            }
            catch (err) {

                console.error(
                    "Errore caricamento profilo pubblico:",
                    err
                );

                setError(
                    "Non è stato possibile caricare il profilo."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadProfile();

    }, [token, userId]);


    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return null;
    }


    const profileImage =
        profile.profilePictureUrl
            ? getImageUrl(profile.profilePictureUrl)
            : null;


    const registrationDate =
        new Date(
            profile.registrationDate
        ).toLocaleDateString(
            "it-IT",
            {
                year: "numeric",
                month: "long"
            }
        );


    return (

        <main className="public-profile-page">

            <button
                className="public-profile-back"
                onClick={() => navigate(-1)}
            >
                ← Torna indietro
            </button>


            <section className="public-profile-card">

                <div className="public-profile-header">

                    <div className="public-profile-avatar">

                        {profileImage ? (

                            <img
                                src={profileImage}
                                alt={`Profilo di ${profile.displayName}`}
                            />

                        ) : (

                            <div className="public-profile-avatar-placeholder">
                                ✦
                            </div>

                        )}

                    </div>


                    <div className="public-profile-identity">


                        <h1>
                            {profile.displayName}
                        </h1>

                        <p className="public-profile-username">
                            @{profile.username}
                        </p>

                        {(profile.city || profile.province) && (

                            <p className="public-profile-location">
                                {profile.city}

                                {profile.city && profile.province
                                    ? ` (${profile.province})`
                                    : profile.province
                                }
                            </p>

                        )}

                        <p className="public-profile-member-since">
                            Membro da {registrationDate}
                        </p>

                    </div>

                </div>


                {profile.bio && (

                    <div className="public-profile-bio">

                        <h2>
                            Su di me
                        </h2>

                        <p>
                            {profile.bio}
                        </p>

                    </div>

                )}


                <div className="public-profile-stats">

                    <div className="public-profile-stat">

                        <span>
                            {profile.totalBooks}
                        </span>

                        <p>
                            Libri
                        </p>

                    </div>


                    <div className="public-profile-stat">

                        <span>
                            {profile.availableBooks}
                        </span>

                        <p>
                            Disponibili
                        </p>

                    </div>


                    <div className="public-profile-stat">

                        <span>
                            {profile.completedLoans}
                        </span>

                        <p>
                            Prestiti completati
                        </p>

                    </div>

                </div>


                <div className="public-profile-actions">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/users/${profile.userId}/books`
                            )
                        }
                    >
                        Vedi libri disponibili
                    </button>

                </div>

            </section>

        </main>

    );
}

export default PublicProfilePage;