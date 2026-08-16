import {
    useEffect,
    useState
} from "react";

import { useAuth }
    from "../../contexts/AuthContext";

import {
    getMyProfile,
    updateProfile,
    type ProfileResponse
} from "../../services/ProfileService";

import "./ProfilePage.css";

function ProfilePage() {

    const { token } = useAuth();

    const [profile, setProfile] =
        useState<ProfileResponse | null>(null);

    const [editing, setEditing] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [displayName, setDisplayName] =
        useState("");

    const [bio, setBio] =
        useState("");

    const [profilePictureUrl, setProfilePictureUrl] =
        useState("");

    const [city, setCity] =
        useState("");

    const [province, setProvince] =
        useState("");

    const [searchRadiusKm, setSearchRadiusKm] =
        useState(20);

    const [isPublicProfile, setIsPublicProfile] =
        useState(true);

    async function loadProfile() {

        if (!token) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyProfile(token);

            setProfile(data);

            setDisplayName(
                data.displayName ?? ""
            );

            setBio(
                data.bio ?? ""
            );

            setProfilePictureUrl(
                data.profilePictureUrl ?? ""
            );

            setCity(
                data.city ?? ""
            );

            setProvince(
                data.province ?? ""
            );

            setSearchRadiusKm(
                data.searchRadiusKm
            );

            setIsPublicProfile(
                data.isPublicProfile
            );

        }
        catch (err) {

            console.error(
                "Errore caricamento profilo:",
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

    useEffect(() => {

        loadProfile();

    }, [token]);

    async function handleSave() {

        if (!token || !profile) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await updateProfile(
                {
                    displayName,
                    bio,
                    profilePictureUrl,
                    city,
                    province,
                    searchRadiusKm,
                    isPublicProfile
                },
                token
            );

            setSuccess(
                "Profilo aggiornato correttamente."
            );

            setEditing(false);

            await loadProfile();

        }
        catch (err) {

            console.error(
                "Errore aggiornamento profilo:",
                err
            );

            setError(
                "Non è stato possibile aggiornare il profilo."
            );

        }
        finally {

            setSaving(false);

        }
    }

    function formatRegistrationDate(
        date: string
    ) {

        return new Date(date)
            .toLocaleDateString(
                "it-IT",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
    }

    if (loading) {
        return (
            <p className="profile-loading">
                Caricamento profilo...
            </p>
        );
    }

    if (error && !profile) {
        return (
            <p className="profile-error">
                {error}
            </p>
        );
    }

    if (!profile) {
        return null;
    }

    return (

        <main className="profile-page">

            <section className="profile-header">

                <div className="profile-avatar">

                    {profile.profilePictureUrl ? (

                        <img
                            src={profile.profilePictureUrl}
                            alt="Immagine profilo"
                        />

                    ) : (

                        <span>
                            {(
                                profile.displayName ||
                                profile.username
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </span>

                    )}

                </div>

                <div className="profile-identity">

                    <p className="profile-eyebrow">
                        IL TUO PROFILO
                    </p>

                    <h1>
                        {
                            profile.displayName ||
                            profile.username
                        }
                    </h1>

                    <p className="profile-username">
                        @{profile.username}
                    </p>

                    <p className="profile-registration">
                        Membro dal{" "}
                        {
                            formatRegistrationDate(
                                profile.registrationDate
                            )
                        }
                    </p>

                </div>

                {!editing && (

                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={() =>
                            setEditing(true)
                        }
                    >
                        Modifica profilo
                    </button>

                )}

            </section>

            <section className="profile-stats">

                <div>
                    <span>
                        {profile.booksOwned}
                    </span>

                    <p>
                        Libri posseduti
                    </p>
                </div>

                <div>
                    <span>
                        {profile.availableBooks}
                    </span>

                    <p>
                        Disponibili
                    </p>
                </div>

                <div>
                    <span>
                        {profile.activeLoans}
                    </span>

                    <p>
                        Prestiti attivi
                    </p>
                </div>

                <div>
                    <span>
                        {profile.completedLoans}
                    </span>

                    <p>
                        Prestiti completati
                    </p>
                </div>

            </section>

            {!editing ? (

                <section className="profile-details">

                    <div className="profile-section">

                        <h2>
                            Biografia
                        </h2>

                        <p>
                            {
                                profile.bio ||
                                "Non hai ancora aggiunto una biografia."
                            }
                        </p>

                    </div>

                    <div className="profile-section">

                        <h2>
                            Località
                        </h2>

                        <p>
                            {
                                profile.city ||
                                profile.province
                                    ? `${profile.city ?? ""}${
                                        profile.city &&
                                        profile.province
                                            ? ", "
                                            : ""
                                    }${profile.province ?? ""}`
                                    : "Località non impostata."
                            }
                        </p>

                    </div>

                    <div className="profile-section">

                        <h2>
                            Raggio di ricerca
                        </h2>

                        <p>
                            {profile.searchRadiusKm} km
                        </p>

                    </div>

                    <div className="profile-section">

                        <h2>
                            Visibilità
                        </h2>

                        <p>
                            {
                                profile.isPublicProfile
                                    ? "Profilo pubblico"
                                    : "Profilo privato"
                            }
                        </p>

                    </div>

                    <div className="profile-section">

                        <h2>
                            Email
                        </h2>

                        <p>
                            {profile.email}
                        </p>

                    </div>

                </section>

            ) : (

                <section className="profile-edit">

                    <div className="profile-edit-grid">

                        <label>
                            Nome visualizzato

                            <input
                                type="text"
                                value={displayName}
                                onChange={(event) =>
                                    setDisplayName(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            URL immagine profilo

                            <input
                                type="text"
                                value={profilePictureUrl}
                                onChange={(event) =>
                                    setProfilePictureUrl(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Città

                            <input
                                type="text"
                                value={city}
                                onChange={(event) =>
                                    setCity(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Provincia

                            <input
                                type="text"
                                value={province}
                                onChange={(event) =>
                                    setProvince(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                    </div>

                    <label className="profile-bio-field">
                        Biografia

                        <textarea
                            rows={5}
                            value={bio}
                            onChange={(event) =>
                                setBio(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="profile-radius">

                        Raggio di ricerca

                        <div>

                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={searchRadiusKm}
                                onChange={(event) =>
                                    setSearchRadiusKm(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            />

                            <span>
                                {searchRadiusKm} km
                            </span>

                        </div>

                    </label>

                    <label className="profile-public">

                        <input
                            type="checkbox"
                            checked={isPublicProfile}
                            onChange={(event) =>
                                setIsPublicProfile(
                                    event.target.checked
                                )
                            }
                        />

                        Profilo pubblico

                    </label>

                    {error && (
                        <p className="profile-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="profile-success">
                            {success}
                        </p>
                    )}

                    <div className="profile-actions">

                        <button
                            type="button"
                            className="profile-cancel"
                            onClick={() => {
                                setEditing(false);
                                loadProfile();
                            }}
                        >
                            Annulla
                        </button>

                        <button
                            type="button"
                            className="profile-save"
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {
                                saving
                                    ? "Salvataggio..."
                                    : "Salva modifiche"
                            }
                        </button>

                    </div>

                </section>

            )}

        </main>

    );
}

export default ProfilePage;