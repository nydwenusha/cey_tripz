import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Layout from "../../Layout";
import { getVehicles } from "../data/vehicles";
import "../css/contact.scss";

const MotionDiv = motion.div;
const WHATSAPP_NUMBER = "94710877100";

const steps = ["Experiences", "Accommodation", "Days", "Traveler Info", "Vehicle", "Summary"];

const experienceCategories = [
  { id: "beach", title: "Beach Relaxation", icon: "bi-umbrella", destinations: ["Bentota", "Mirissa", "Unawatuna", "Arugam Bay"] },
  { id: "wildlife", title: "Wildlife Safari", icon: "bi-binoculars", destinations: ["Yala", "Udawalawe", "Wilpattu", "Minneriya"] },
  { id: "culture", title: "Cultural Heritage", icon: "bi-bank", destinations: ["Sigiriya", "Kandy", "Dambulla", "Polonnaruwa"] },
  { id: "tea", title: "Tea Plantation Visit", icon: "bi-flower1", destinations: ["Nuwara Eliya", "Ella", "Haputale", "Hatton"] },
  { id: "train", title: "Scenic Train Journey", icon: "bi-train-front", destinations: ["Kandy to Ella", "Nanu Oya to Ella", "Colombo to Kandy"] },
  { id: "whales", title: "Whale Watching", icon: "bi-water", destinations: ["Mirissa", "Trincomalee", "Kalpitiya"] },
];

const accommodationStyles = [
  { id: "budget", title: "Budget Stay", price: "$15 - $40 per night", description: "Guest houses, hostels, homestays", audience: "Backpackers & budget travelers" },
  { id: "standard", title: "Standard Comfort", price: "$40 - $80 per night", description: "3-star hotels with essential facilities", audience: "Families & regular tourists" },
  { id: "premium", title: "Premium Stay", price: "$80 - $150 per night", description: "4-star hotels with breakfast and good amenities", audience: "Couples & comfortable vacations" },
  { id: "luxury", title: "Luxury Escape", price: "$150 - $300+ per night", description: "5-star hotels, boutique resorts", audience: "Honeymooners & luxury travelers" },
  { id: "ultra-luxury", title: "Ultra Luxury", price: "$300 - $1000+ per night", description: "Private villas, luxury beach resorts", audience: "VIP & premium experiences" },
];

const initialPlanner = {
  fullCategories: [], destinations: {}, customDestinations: {}, wantsAccommodation: null, accommodationStyle: "", mealsIncluded: false,
  duration: 1, startDate: "", adults: 2, children: 0, infants: 0, fullName: "", email: "", phone: "",
  country: "", vehicle: "", specialRequest: "",
};

const contactHighlights = [
  { title: "Travel Concierge", copy: "Curated itineraries, multi-day tours, and bespoke experiences crafted in under 24 hours.", href: "tel:+94717191657", detail: "+94 71 719 1657", icon: "bi-globe-asia-australia" },
  { title: "Fleet Hotline", copy: "Real-time vehicle tracking, chauffeur briefings, and last-minute swaps handled instantly.", href: "tel:+94758793281", detail: "+94 75 879 3281", icon: "bi-truck-front" },
  { title: "WhatsApp Desk", copy: "Share pins, voice notes, or documents on the go — we reply in minutes around the clock.", href: `https://wa.me/${WHATSAPP_NUMBER}`, detail: "Chat on WhatsApp", icon: "bi-whatsapp" },
];

const serviceHours = [
  { label: "Weekdays", value: "06:00 – 22:00 IST" },
  { label: "Weekends", value: "08:00 – 20:00 IST" },
  { label: "Emergency", value: "24/7 duty manager" },
];

function Counter({ label, value, min = 0, max = 45, onChange }) {
  return (
    <div className="trip-counter">
      <span>{label}</span>
      <div className="trip-counter-controls">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <strong aria-live="polite">{value}</strong>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

function Contact() {
  const [currentStep, setCurrentStep] = useState(0);
  const [planner, setPlanner] = useState(initialPlanner);
  const [stepError, setStepError] = useState("");
  const [customLocationEntry, setCustomLocationEntry] = useState({ categoryId: "", value: "", error: "" });
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState("");
  const [vehicleReloadKey, setVehicleReloadKey] = useState(0);
  const plannerRef = useRef(null);

  const selectedDestinations = useMemo(() => Object.values(planner.destinations).flat(), [planner.destinations]);
  const totalSelected = planner.fullCategories.length + selectedDestinations.length;
  const totalTravelers = planner.adults + planner.children + planner.infants;
  const selectedAccommodation = accommodationStyles.find((item) => item.id === planner.accommodationStyle);
  const selectedVehicle = vehicleOptions.find((item) => item.id === planner.vehicle);

  useEffect(() => {
    let isActive = true;

    const loadVehicles = async () => {
      setVehiclesLoading(true);
      setVehiclesError("");

      try {
        const nextVehicles = await getVehicles();
        if (!isActive) return;
        setVehicleOptions(nextVehicles);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load planner vehicles:", error);
        setVehicleOptions([]);
        setVehiclesError("We could not load the available vehicles. Please try again.");
      } finally {
        if (isActive) setVehiclesLoading(false);
      }
    };

    loadVehicles();
    return () => { isActive = false; };
  }, [vehicleReloadKey]);

  useEffect(() => {
    if (window.location.hash !== "#trip-planner") return undefined;

    let innerFrame;
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        plannerRef.current?.focus({ preventScroll: true });
      });
    });

    return () => {
      window.cancelAnimationFrame(outerFrame);
      if (innerFrame) window.cancelAnimationFrame(innerFrame);
    };
  }, []);

  const updatePlanner = (changes) => {
    setPlanner((previous) => ({ ...previous, ...changes }));
    setStepError("");
  };

  const scrollToPlanner = () => window.requestAnimationFrame(() => plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  const setStep = (nextStep) => {
    setCurrentStep(nextStep);
    setStepError("");
    scrollToPlanner();
  };

  const toggleFullCategory = (categoryId) => {
    const isSelected = planner.fullCategories.includes(categoryId);
    const fullCategories = isSelected ? planner.fullCategories.filter((id) => id !== categoryId) : [...planner.fullCategories, categoryId];
    const destinations = { ...planner.destinations };
    if (!isSelected) delete destinations[categoryId];
    updatePlanner({ fullCategories, destinations });
  };

  const toggleDestination = (categoryId, destination) => {
    const current = planner.destinations[categoryId] || [];
    const destinations = {
      ...planner.destinations,
      [categoryId]: current.includes(destination) ? current.filter((item) => item !== destination) : [...current, destination],
    };
    if (!destinations[categoryId].length) delete destinations[categoryId];
    updatePlanner({ destinations, fullCategories: planner.fullCategories.filter((id) => id !== categoryId) });
  };

  const openCustomLocation = (categoryId) => {
    setCustomLocationEntry((current) => ({
      categoryId: current.categoryId === categoryId ? "" : categoryId,
      value: "",
      error: "",
    }));
  };

  const addCustomLocation = (event, category) => {
    event.preventDefault();
    const location = customLocationEntry.value.replace(/\s+/g, " ").trim();
    if (location.length < 2) {
      setCustomLocationEntry((current) => ({ ...current, error: "Enter a valid location name." }));
      return;
    }

    const customLocations = planner.customDestinations[category.id] || [];
    const existingLocation = [...category.destinations, ...customLocations].find(
      (item) => item.toLocaleLowerCase() === location.toLocaleLowerCase(),
    );
    const selectedForCategory = planner.destinations[category.id] || [];

    if (existingLocation && selectedForCategory.includes(existingLocation)) {
      setCustomLocationEntry((current) => ({ ...current, error: "This location is already selected." }));
      return;
    }

    const locationToSelect = existingLocation || location;
    const destinations = {
      ...planner.destinations,
      [category.id]: [...selectedForCategory, locationToSelect],
    };
    const customDestinations = existingLocation
      ? planner.customDestinations
      : { ...planner.customDestinations, [category.id]: [...customLocations, location] };

    updatePlanner({
      destinations,
      customDestinations,
      fullCategories: planner.fullCategories.filter((id) => id !== category.id),
    });
    setCustomLocationEntry({ categoryId: "", value: "", error: "" });
  };

  const removeCustomLocation = (categoryId, location) => {
    const customDestinations = {
      ...planner.customDestinations,
      [categoryId]: (planner.customDestinations[categoryId] || []).filter((item) => item !== location),
    };
    const destinations = {
      ...planner.destinations,
      [categoryId]: (planner.destinations[categoryId] || []).filter((item) => item !== location),
    };
    if (!customDestinations[categoryId].length) delete customDestinations[categoryId];
    if (!destinations[categoryId].length) delete destinations[categoryId];
    updatePlanner({ customDestinations, destinations });
  };

  const validateCurrentStep = () => {
    if (currentStep === 0 && totalSelected === 0) return "Choose at least one experience category or destination.";
    if (currentStep === 1) {
      if (planner.wantsAccommodation === null) return "Tell us whether you would like accommodation arranged.";
      if (planner.wantsAccommodation && !planner.accommodationStyle) return "Select an accommodation style.";
    }
    if (currentStep === 2 && !planner.startDate) return "Select your preferred start date.";
    if (currentStep === 3) {
      if (totalTravelers < 1) return "Add at least one traveler.";
      if (!planner.fullName.trim()) return "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(planner.email.trim())) return "Enter a valid email address.";
      if (!planner.phone.trim()) return "Enter your phone or WhatsApp number.";
      if (!planner.country.trim()) return "Enter your country.";
    }
    if (currentStep === 4) {
      if (vehiclesLoading) return "Please wait while the available vehicles load.";
      if (vehiclesError) return "Reload the available vehicles before continuing.";
      if (!vehicleOptions.length) return "There are no active vehicles available right now.";
      if (!selectedVehicle) return "Select a vehicle for your trip.";
      if (selectedVehicle.capacityValue < totalTravelers) return "Select a vehicle that fits your group.";
    }
    return "";
  };

  const handleNext = () => {
    const error = validateCurrentStep();
    if (error) return setStepError(error);
    setStep(Math.min(steps.length - 1, currentStep + 1));
  };

  const resetPlanner = () => {
    setPlanner(initialPlanner);
    setCurrentStep(0);
    setStepError("");
    setCustomLocationEntry({ categoryId: "", value: "", error: "" });
    scrollToPlanner();
  };

  const experienceMessage = () => {
    const full = planner.fullCategories.map((id) => experienceCategories.find((category) => category.id === id)?.title);
    const places = experienceCategories.flatMap((category) => (planner.destinations[category.id] || []).map((destination) => `${category.title}: ${destination}`));
    return [full.length ? `Full categories: ${full.join(", ")}` : "", places.length ? `Specific places: ${places.join("; ")}` : ""].filter(Boolean).join("\n");
  };

  const sendToWhatsApp = () => {
    const accommodation = planner.wantsAccommodation
      ? `${selectedAccommodation?.title || "Requested"}${planner.mealsIncluded ? " with meals" : ", meals not included"}`
      : "Traveler will arrange accommodation";
    const message = [
      "*New Custom Trip Request*", "", `*Customer:* ${planner.fullName}`, `*Email:* ${planner.email}`,
      `*Phone:* ${planner.phone}`, `*Country:* ${planner.country}`, "",
      `*Travelers:* ${planner.adults} adult(s), ${planner.children} child(ren), ${planner.infants} infant(s)`,
      `*Duration:* ${planner.duration} day(s)`, `*Preferred start date:* ${planner.startDate}`,
      `*Accommodation:* ${accommodation}`, `*Vehicle:* ${selectedVehicle?.name || "Not selected"}`, "",
      "*Experiences:*", experienceMessage(), "", `*Special request:* ${planner.specialRequest.trim() || "None"}`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const renderExperiences = () => (
    <div className="trip-step-body">
      <div className="trip-intro-panel">
        <div><span className="trip-kicker">Build your route</span><h3>Add custom experiences</h3><p>Select complete categories or choose the specific destinations that matter to you.</p></div>
        <div className="trip-total-badge"><span>Total selected</span><strong>{totalSelected}</strong></div>
      </div>
      <div className="experience-grid">
        {experienceCategories.map((category) => {
          const fullSelected = planner.fullCategories.includes(category.id);
          const picked = planner.destinations[category.id] || [];
          const customLocations = planner.customDestinations[category.id] || [];
          const availableDestinations = [...category.destinations, ...customLocations];
          const count = fullSelected ? availableDestinations.length : picked.length;
          return (
            <article className={`experience-card ${fullSelected ? "is-selected" : ""}`} key={category.id}>
              <div className="experience-card-head">
                <div><i className={`bi ${category.icon}`} /><h4>{category.title}</h4><span>{count} destination{count === 1 ? "" : "s"}</span></div>
                <button type="button" className={`category-select ${fullSelected ? "is-selected" : ""}`} aria-pressed={fullSelected} onClick={() => toggleFullCategory(category.id)}>{fullSelected ? <i className="bi bi-check-lg" /> : "Select all"}</button>
              </div>
              <div className="destination-options">
                {availableDestinations.map((destination) => {
                  const checked = picked.includes(destination);
                  const isCustom = customLocations.includes(destination);
                  return (
                    <div className={`destination-option-row ${isCustom ? "is-custom" : ""}`} key={destination}>
                      <label className={`destination-option ${checked ? "is-selected" : ""}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleDestination(category.id, destination)} />
                        <i className="bi bi-geo-alt" aria-hidden="true" />
                        <span>{destination}</span>
                        {isCustom && <small>Custom</small>}
                      </label>
                      {isCustom && (
                        <button type="button" className="remove-custom-location" aria-label={`Remove ${destination}`} onClick={() => removeCustomLocation(category.id, destination)}>
                          <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button type="button" className="add-custom-location-toggle" aria-expanded={customLocationEntry.categoryId === category.id} onClick={() => openCustomLocation(category.id)}>
                  <i className={`bi ${customLocationEntry.categoryId === category.id ? "bi-x" : "bi-plus-lg"}`} aria-hidden="true" />
                  {customLocationEntry.categoryId === category.id ? "Cancel" : "Other location"}
                </button>
                {customLocationEntry.categoryId === category.id && (
                  <form className="custom-location-form" onSubmit={(event) => addCustomLocation(event, category)}>
                    <label htmlFor={`custom-location-${category.id}`}>Add another location</label>
                    <div>
                      <input
                        id={`custom-location-${category.id}`}
                        type="text"
                        maxLength="60"
                        autoFocus
                        placeholder="e.g. Hiriketiya"
                        value={customLocationEntry.value}
                        onChange={(event) => setCustomLocationEntry((current) => ({ ...current, value: event.target.value, error: "" }))}
                      />
                      <button type="submit">Add</button>
                    </div>
                    {customLocationEntry.error && <span role="alert">{customLocationEntry.error}</span>}
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

  const renderAccommodation = () => (
    <div className="trip-step-body">
      <div className="trip-section-title"><i className="bi bi-building" /><div><span className="trip-kicker">Stay preferences</span><h3>Accommodation preference</h3></div></div>
      <fieldset className="trip-fieldset">
        <legend>Do you want accommodation from us?</legend>
        <div className="binary-choice-grid">
          <label className={`choice-card ${planner.wantsAccommodation === true ? "is-selected" : ""}`}><input type="radio" name="wantsAccommodation" checked={planner.wantsAccommodation === true} onChange={() => updatePlanner({ wantsAccommodation: true })} /><strong>Yes, arrange accommodation</strong><span>Show hotel styles and meal options for this custom trip.</span></label>
          <label className={`choice-card ${planner.wantsAccommodation === false ? "is-selected" : ""}`}><input type="radio" name="wantsAccommodation" checked={planner.wantsAccommodation === false} onChange={() => updatePlanner({ wantsAccommodation: false, accommodationStyle: "", mealsIncluded: false })} /><strong>No, I will arrange accommodation</strong><span>Send the trip request without hotel requirements.</span></label>
        </div>
      </fieldset>
      {planner.wantsAccommodation && <>
        <fieldset className="trip-fieldset accommodation-fieldset"><legend>Select accommodation style</legend><div className="accommodation-grid">
          {accommodationStyles.map((style) => <label className={`accommodation-card ${planner.accommodationStyle === style.id ? "is-selected" : ""}`} key={style.id}><input type="radio" name="accommodationStyle" checked={planner.accommodationStyle === style.id} onChange={() => updatePlanner({ accommodationStyle: style.id })} /><strong>{style.title}</strong><b>{style.price}</b><span>{style.description}</span><small>{style.audience}</small></label>)}
        </div></fieldset>
        <label className={`meal-choice ${planner.mealsIncluded ? "is-selected" : ""}`}><input type="checkbox" checked={planner.mealsIncluded} onChange={(event) => updatePlanner({ mealsIncluded: event.target.checked })} /><span><strong>Yes, include meals with accommodation</strong><small>Add hotel meals to your custom trip plan.</small></span></label>
      </>}
    </div>
  );

  const renderDays = () => (
    <div className="trip-step-body">
      <div className="trip-section-title"><i className="bi bi-clock" /><div><span className="trip-kicker">Trip schedule</span><h3>Select travel days</h3></div></div>
      <div className="duration-panel">
        <div><span className="trip-kicker">Trip duration</span><strong>{planner.duration} day{planner.duration === 1 ? "" : "s"}</strong><small>Enter any number of days from 1 upward.</small></div>
        <div className="duration-counter"><button type="button" aria-label="Decrease trip duration" disabled={planner.duration <= 1} onClick={() => updatePlanner({ duration: Math.max(1, planner.duration - 1) })}>−</button><input type="number" min="1" max="90" aria-label="Trip duration in days" value={planner.duration} onChange={(event) => updatePlanner({ duration: Math.max(1, Number(event.target.value) || 1) })} /><button type="button" aria-label="Increase trip duration" onClick={() => updatePlanner({ duration: Math.min(90, planner.duration + 1) })}>+</button></div>
        <div className="duration-presets">{[1, 3, 5, 7].map((days) => <button type="button" className={planner.duration === days ? "is-selected" : ""} key={days} onClick={() => updatePlanner({ duration: days })}>{days} day{days === 1 ? "" : "s"}</button>)}</div>
      </div>
      <label className="date-field"><span><i className="bi bi-calendar3" /> Preferred start date</span><input type="date" min={new Date().toISOString().split("T")[0]} value={planner.startDate} onChange={(event) => updatePlanner({ startDate: event.target.value })} /></label>
    </div>
  );

  const renderTravelerInfo = () => (
    <div className="trip-step-body">
      <div className="trip-section-title"><i className="bi bi-people" /><div><span className="trip-kicker">Your travel party</span><h3>Traveler information</h3></div></div>
      <div className="traveler-counter-grid">
        <Counter label="Adults" value={planner.adults} min={1} onChange={(adults) => updatePlanner({ adults, vehicle: "" })} />
        <Counter label="Children" value={planner.children} onChange={(children) => updatePlanner({ children, vehicle: "" })} />
        <Counter label="Infants" value={planner.infants} onChange={(infants) => updatePlanner({ infants, vehicle: "" })} />
      </div>
      <div className="traveler-form-grid">
        <label><span>Full name</span><input type="text" autoComplete="name" placeholder="Alex Perera" value={planner.fullName} onChange={(event) => updatePlanner({ fullName: event.target.value })} /></label>
        <label><span>Email address</span><input type="email" autoComplete="email" placeholder="alex@journeys.io" value={planner.email} onChange={(event) => updatePlanner({ email: event.target.value })} /></label>
        <label><span>Phone / WhatsApp</span><input type="tel" autoComplete="tel" placeholder="(+94) 71 123 4567" value={planner.phone} onChange={(event) => updatePlanner({ phone: event.target.value })} /></label>
        <label><span>Country</span><input type="text" autoComplete="country-name" placeholder="Sri Lanka" value={planner.country} onChange={(event) => updatePlanner({ country: event.target.value })} /></label>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="trip-step-body">
      <div className="trip-section-title"><i className="bi bi-car-front" /><div><span className="trip-kicker">Private transport</span><h3>Select vehicle</h3></div></div>
      <div className="traveler-total-strip"><span>Total travelers</span><strong>{totalTravelers}</strong></div>
      {vehiclesLoading ? (
        <div className="vehicle-load-state" role="status"><span className="vehicle-loader" /><strong>Loading available vehicles...</strong></div>
      ) : vehiclesError ? (
        <div className="vehicle-load-state is-error" role="alert"><i className="bi bi-exclamation-circle" /><div><strong>Vehicles unavailable</strong><span>{vehiclesError}</span></div><button type="button" onClick={() => setVehicleReloadKey((key) => key + 1)}>Try again</button></div>
      ) : vehicleOptions.length === 0 ? (
        <div className="vehicle-load-state"><i className="bi bi-car-front" /><div><strong>No active vehicles</strong><span>Please contact our travel desk for a custom transport option.</span></div></div>
      ) : (
        <div className="vehicle-grid">{vehicleOptions.map((vehicle) => {
          const unavailable = vehicle.capacityValue < totalTravelers;
          return (
            <label className={`vehicle-card ${planner.vehicle === vehicle.id ? "is-selected" : ""} ${unavailable ? "is-disabled" : ""}`} key={vehicle.id}>
              <input type="radio" name="vehicle" checked={planner.vehicle === vehicle.id} disabled={unavailable} onChange={() => updatePlanner({ vehicle: vehicle.id })} />
              {vehicle.cardImg ? <img src={vehicle.cardImg} alt="" className="vehicle-option-image" /> : <i className="bi bi-car-front-fill vehicle-option-icon" />}
              <span>
                <strong>{vehicle.name}</strong>
                <small>{vehicle.shortDesc || vehicle.type}</small>
                <span className="vehicle-option-meta"><b>{vehicle.capacityValue} seats</b><b>{vehicle.price}</b>{vehicle.transmission && <b>{vehicle.transmission}</b>}</span>
              </span>
              {planner.vehicle === vehicle.id && <i className="bi bi-check-circle-fill vehicle-check" />}
              {unavailable && <em>Too small for your group</em>}
            </label>
          );
        })}</div>
      )}
    </div>
  );

  const renderSummary = () => {
    const fullNames = planner.fullCategories.map((id) => experienceCategories.find((category) => category.id === id)?.title);
    const placeNames = experienceCategories.flatMap((category) => (planner.destinations[category.id] || []).map((destination) => `${destination} (${category.title})`));
    return (
      <div className="trip-step-body">
        <div className="trip-section-title"><i className="bi bi-check2-circle" /><div><span className="trip-kicker">Review your choices</span><h3>Trip summary</h3></div></div>
        <div className="summary-grid">
          <div><span>Full categories</span><strong>{fullNames.length || "None"}</strong></div><div><span>Accommodation</span><strong>{planner.wantsAccommodation ? selectedAccommodation?.title : "Self-arranged"}</strong></div><div><span>Meals</span><strong>{planner.mealsIncluded ? "Included" : "Not included"}</strong></div>
          <div><span>Duration</span><strong>{planner.duration} day{planner.duration === 1 ? "" : "s"}</strong></div><div><span>Start date</span><strong>{planner.startDate}</strong></div><div><span>Travelers</span><strong>{planner.adults} adults, {planner.children} children, {planner.infants} infants</strong></div>
          <div><span>Vehicle</span><strong>{selectedVehicle?.name}</strong></div><div className="summary-customer"><span>Customer</span><strong>{planner.fullName}</strong><small>{planner.email} · {planner.phone} · {planner.country}</small></div>
        </div>
        <div className="summary-list-card"><h4>Selected categories</h4>{fullNames.length ? <div className="summary-tags">{fullNames.map((name) => <span key={name}>{name}</span>)}</div> : <p>No complete categories selected.</p>}</div>
        <div className="summary-list-card"><h4>Selected destinations</h4>{placeNames.length ? <div className="summary-tags">{placeNames.map((name) => <span key={name}>{name}</span>)}</div> : <p>No specific destinations selected.</p>}</div>
        <label className="special-request-field"><span>Anything else we should know?</span><textarea rows="4" placeholder="Accessibility needs, dietary preferences, celebration plans, pickup details..." value={planner.specialRequest} onChange={(event) => updatePlanner({ specialRequest: event.target.value })} /></label>
        <div className="whatsapp-notice"><i className="bi bi-whatsapp" /><div><strong>Ready to send</strong><span>Your choices will be formatted into a WhatsApp message for our travel desk.</span></div></div>
      </div>
    );
  };

  const stepContent = [renderExperiences, renderAccommodation, renderDays, renderTravelerInfo, renderVehicles, renderSummary];

  return (
    <Layout>
      <section className="contact-page">
        <Container className="contact-wrapper py-5">
          <MotionDiv className="contact-hero text-center" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="contact-eyebrow">Made around the way you travel</p><h1>Custom Trip Planner</h1><p className="contact-lede">Build your Sri Lankan journey step by step, then send the complete request directly to our travel desk.</p>
          </MotionDiv>
          <Row className="g-4 contact-highlight-row">
            {contactHighlights.map((item, index) => <Col md={4} key={item.title}><MotionDiv initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="h-100"><Card className="contact-info-card h-100"><div className="contact-icon"><i className={`bi ${item.icon}`} /></div><h4>{item.title}</h4><p>{item.copy}</p><a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>{item.detail}</a></Card></MotionDiv></Col>)}
          </Row>

          <Row className="g-4 contact-support-row">
            <Col lg={7}>
              <Card className="contact-meta-card h-100">
                <h5>Operations desk</h5>
                <p>We monitor every route via GPS and weather alerts so we can reroute before delays hit.</p>
                <ul>
                  {serviceHours.map((slot) => (
                    <li key={slot.label}>
                      <span>{slot.label}</span>
                      <strong>{slot.value}</strong>
                    </li>
                  ))}
                </ul>
                <div className="badge-row">
                  <span>Response under 15 min</span>
                  <span>Multi-lingual team</span>
                  <span>Duty manager on-call</span>
                </div>
              </Card>
            </Col>
            <Col lg={5}>
              <div className="contact-map-card h-100">
                <div className="map-overlay">
                  <p>Head office</p>
                  <h4>45 Galle Road, Colombo</h4>
                  <small>Drop by for coffee & route planning</small>
                </div>
                <iframe
                  title="Cey Tripz HQ"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.896315101553!2d79.85207367601632!3d6.927078893068712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259338a0a15c5%3A0x56c1d9f4f7968d17!2sGalle%20Rd%2C%20Colombo%2000300!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Col>
          </Row>

          <MotionDiv id="trip-planner" ref={plannerRef} tabIndex="-1" className="custom-trip-planner" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.08 }}>
            <div className="planner-heading">
              <div className="planner-heading-mark"><i className="bi bi-map" aria-hidden="true" /></div>
              <div className="planner-heading-copy">
                <h2>Plan your Sri Lanka trip</h2>
                <p>Choose your route, stay and transport details.</p>
              </div>
              <div className="planner-step-status" aria-live="polite">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <strong>{steps[currentStep]}</strong>
              </div>
            </div>
            <nav className="trip-stepper" aria-label="Trip planner progress">
              {steps.map((step, index) => {
                const complete = index < currentStep; const current = index === currentStep;
                return <button type="button" className={`${complete ? "is-complete" : ""} ${current ? "is-current" : ""}`} key={step} aria-current={current ? "step" : undefined} disabled={index > currentStep} onClick={() => index < currentStep && setStep(index)}><span>{complete ? <i className="bi bi-check-lg" /> : index + 1}</span><small>{step}</small></button>;
              })}
            </nav>
            <div className="planner-card">
              <MotionDiv key={currentStep} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>{stepContent[currentStep]()}</MotionDiv>
              {stepError && <div className="trip-error" role="alert"><i className="bi bi-exclamation-circle" />{stepError}</div>}
              <div className="planner-actions">
                {currentStep > 0 ? <button type="button" className="trip-back-btn" onClick={() => setStep(Math.max(0, currentStep - 1))}><i className="bi bi-arrow-left" /> Back</button> : <span />}
                {currentStep < steps.length - 1 ? <button type="button" className="trip-next-btn" onClick={handleNext}>Next <i className="bi bi-arrow-right" /></button> : <button type="button" className="trip-whatsapp-btn" onClick={sendToWhatsApp}><i className="bi bi-whatsapp" /> Send via WhatsApp</button>}
              </div>
            </div>
            <button type="button" className="reset-planner" onClick={resetPlanner}><i className="bi bi-arrow-counterclockwise" /> Reset planner</button>
          </MotionDiv>

        </Container>
      </section>
    </Layout>
  );
}

export default Contact;
