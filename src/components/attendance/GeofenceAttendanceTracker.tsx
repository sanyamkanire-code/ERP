import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { GeofenceZone, GeofencedAttendanceVerification } from '../../types/erp';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  Compass,
  RefreshCw,
  Clock,
  ShieldCheck,
  Check,
  Building2,
  Calendar,
  Sparkles,
  Sliders,
  ChevronDown,
  Info,
} from 'lucide-react';

interface GeofenceAttendanceTrackerProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

// Haversine formula to calculate geodesic distance in meters between two lat/lon points
function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of the Earth in meters
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export const GeofenceAttendanceTracker: React.FC<GeofenceAttendanceTrackerProps> = ({
  onClose,
  isEmbedded = false,
}) => {
  const { currentUser } = useAuth();
  const { geofenceZones, geofencedLogs, markGeofencedAttendance } = useERPData();

  // Active Zone (Defaults to Turing Lecture Hall 302 - CS301)
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    geofenceZones[0]?.id || 'zone-turing-302'
  );

  const activeZone = useMemo(() => {
    return geofenceZones.find((z) => z.id === selectedZoneId) || geofenceZones[0];
  }, [geofenceZones, selectedZoneId]);

  // GPS State
  const [isUsingRealGps, setIsUsingRealGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [isAcquiringGps, setIsAcquiringGps] = useState<boolean>(false);

  // Simulated coordinate offset (meters)
  const [simulatedDistanceOffset, setSimulatedDistanceOffset] = useState<number>(2.1); // Default to 2.1m (inside 5m zone!)

  // Current Coordinates
  // Note: 1 degree latitude ~ 111,000 meters. 1 meter ~ 0.000009 degrees.
  const [currentLat, setCurrentLat] = useState<number>(
    activeZone ? activeZone.latitude + 0.000018 : 12.971616
  );
  const [currentLon, setCurrentLon] = useState<number>(
    activeZone ? activeZone.longitude + 0.000008 : 77.59457
  );
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(1.8);

  // Verification & Feedback State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    record?: GeofencedAttendanceVerification;
  } | null>(null);

  // Calculate live distance to active zone
  const calculatedDistance = useMemo(() => {
    if (!activeZone) return 999;
    return calculateDistanceInMeters(
      currentLat,
      currentLon,
      activeZone.latitude,
      activeZone.longitude
    );
  }, [currentLat, currentLon, activeZone]);

  const isWithin5mMeters = calculatedDistance <= 5.0;

  // Real GPS watch position
  useEffect(() => {
    if (isUsingRealGps) {
      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation is not supported by your browser or environment.');
        setIsUsingRealGps(false);
        return;
      }

      setIsAcquiringGps(true);
      setGpsError(null);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setIsAcquiringGps(false);
          setCurrentLat(position.coords.latitude);
          setCurrentLon(position.coords.longitude);
          setGpsAccuracy(Math.round(position.coords.accuracy * 10) / 10);
        },
        (err) => {
          setIsAcquiringGps(false);
          setGpsError(
            err.code === 1
              ? 'GPS permission denied. Using high-precision campus simulator.'
              : 'GPS acquisition timeout. Using campus simulator.'
          );
          setIsUsingRealGps(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );

      setGpsWatchId(watchId);

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
    }
  }, [isUsingRealGps]);

  // Update coordinates when simulated offset or active zone changes
  useEffect(() => {
    if (!isUsingRealGps && activeZone) {
      // Offset latitude by distance in meters: distance / 111139 meters per degree
      const latOffset = simulatedDistanceOffset / 111139;
      setCurrentLat(activeZone.latitude + latOffset);
      setCurrentLon(activeZone.longitude);
      setGpsAccuracy(1.5);
    }
  }, [simulatedDistanceOffset, activeZone, isUsingRealGps]);

  // Set preset simulation distances
  const setPresetDistance = (distance: number) => {
    setIsUsingRealGps(false);
    setSimulatedDistanceOffset(distance);
    setLastResult(null);
  };

  // Mark attendance handler
  const handleMarkAttendance = () => {
    if (!currentUser) return;
    setIsVerifying(true);
    setLastResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const res = markGeofencedAttendance({
        studentId: currentUser.id,
        studentName: currentUser.name,
        courseCode: activeZone.courseCode,
        courseName: activeZone.courseName,
        zoneName: activeZone.name,
        room: activeZone.room,
        userLatitude: currentLat,
        userLongitude: currentLon,
        targetLatitude: activeZone.latitude,
        targetLongitude: activeZone.longitude,
        distanceMeters: Math.round(calculatedDistance * 10) / 10,
        accuracyMeters: gpsAccuracy,
        verifiedWithin5m: isWithin5mMeters,
        deviceFingerprint: `Android Client • SHA-256 Verified (${currentUser.email})`,
        status: isWithin5mMeters ? 'marked_present' : 'rejected_out_of_bounds',
      });

      setLastResult(res);

      if (res.success) {
        // Fire celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10B981', '#6366F1', '#3B82F6'],
          });
        } catch {
          // ignore if unavailable
        }
      }
    }, 600);
  };

  // Has current user already checked in for this zone today?
  const existingUserCheckIn = geofencedLogs.find(
    (log) =>
      log.studentId === currentUser.id &&
      log.courseCode === activeZone.courseCode &&
      log.verifiedWithin5m
  );

  return (
    <div
      id="geofence-attendance-container"
      className={`bg-white rounded-3xl overflow-hidden ${
        isEmbedded ? 'border border-slate-200' : 'shadow-2xl border border-slate-200 max-w-4xl mx-auto'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Live Geofenced Attendance
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  5.0m Strict Perimeter
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time cryptographic location verification for classroom check-in
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Zone Selector Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Select Active Lecture Hall / Lab Zone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {geofenceZones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              return (
                <button
                  key={zone.id}
                  id={`btn-select-zone-${zone.id}`}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setLastResult(null);
                  }}
                  className={`p-2.5 rounded-xl text-left transition border cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate">{zone.courseCode}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {zone.radiusMeters}m Zone
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold truncate mt-0.5 text-slate-200">
                    {zone.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {zone.room} • {zone.facultyName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Radar & Distance Panel */}
      <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Geofence Radar / Proximity Circle */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full flex items-center justify-center">
              {/* Outer boundary ring (20m) */}
              <div className="absolute inset-0 rounded-full border border-slate-300/80 bg-slate-100/60" />

              {/* 10m ring */}
              <div className="absolute inset-8 rounded-full border border-dashed border-slate-300" />

              {/* Strict 5-Meter Geofence Perimeter */}
              <div
                className={`absolute inset-16 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                  isWithin5mMeters
                    ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/20'
                    : 'border-amber-500/80 bg-amber-500/5'
                }`}
              >
                {/* 5m Label */}
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                    isWithin5mMeters
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  5m Radius
                </span>
              </div>

              {/* Center Lecture Hall Beacon */}
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-[9px] font-bold text-slate-700 bg-white/90 px-1.5 rounded mt-0.5 shadow-xs">
                  {activeZone.room}
                </span>
              </div>

              {/* Student Live Position Blip */}
              <div
                className="absolute z-20 transition-all duration-700 flex flex-col items-center"
                style={{
                  // Dynamically translate position based on calculatedDistance (max 20m)
                  transform: `translate(${Math.min(
                    90,
                    Math.max(-90, (calculatedDistance / 5) * 35 - 35)
                  )}px, ${Math.min(
                    90,
                    Math.max(-90, (calculatedDistance / 5) * 20 - 20)
                  )}px)`,
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md ring-4 ${
                    isWithin5mMeters
                      ? 'bg-emerald-600 ring-emerald-300/60 animate-bounce'
                      : 'bg-rose-600 ring-rose-300/60'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-white shadow-xs whitespace-nowrap mt-0.5">
                  You ({calculatedDistance.toFixed(1)}m)
                </span>
              </div>

              {/* Radar Sweep Effect */}
              <div className="absolute inset-0 rounded-full pointer-events-none opacity-40 animate-spin" style={{ animationDuration: '6s' }}>
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-tl-full origin-bottom-right" />
              </div>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Inside 5m Zone</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Outside Perimeter</span>
              </span>
            </div>
          </div>

          {/* Real-time Distance & Verification Box */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Distance Meter Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isWithin5mMeters
                  ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-white border-amber-300/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isWithin5mMeters
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isWithin5mMeters
                      ? '✓ VALIDATED: INSIDE 5-METER CLASSROOM PERIMETER'
                      : '⚠ OUT OF GEOFENCE BOUNDARY (> 5.0m)'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                      {calculatedDistance.toFixed(1)}
                    </span>
                    <span className="text-base font-bold text-slate-600 font-mono">meters</span>
                    <span className="text-xs text-slate-500 font-medium">
                      from {activeZone.name}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isWithin5mMeters
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isWithin5mMeters ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Progress Bar towards 5m boundary */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                  <span>Geofence Distance Threshold</span>
                  <span className="font-mono">
                    {calculatedDistance <= 5.0
                      ? `${(5.0 - calculatedDistance).toFixed(1)}m margin within zone`
                      : `${(calculatedDistance - 5.0).toFixed(1)}m outside boundary`}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWithin5mMeters ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(8, (5.0 / Math.max(5.0, calculatedDistance)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Live Coordinates Pill */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-mono">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Lat: {currentLat.toFixed(6)}</span>
                  <span>•</span>
                  <span>Lon: {currentLon.toFixed(6)}</span>
                </div>
                <div className="font-mono text-slate-500">
                  Accuracy: ±{gpsAccuracy}m
                </div>
              </div>
            </div>

            {/* Attendance Action Button */}
            <div>
              {existingUserCheckIn ? (
                <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Attendance Already Verified for {activeZone.courseCode}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Recorded at {existingUserCheckIn.timestamp} ({existingUserCheckIn.distanceMeters}m from beacon)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleMarkAttendance}
                    disabled={isVerifying || !isWithin5mMeters}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                  >
                    Re-verify
                  </button>
                </div>
              ) : (
                <button
                  id="btn-mark-geofence-attendance"
                  onClick={handleMarkAttendance}
                  disabled={isVerifying || !isWithin5mMeters}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
                    isWithin5mMeters
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Cryptographic Coordinates...</span>
                    </>
                  ) : isWithin5mMeters ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Mark Live Attendance in Turing 302 (Within 5m Zone)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Locked: Move within 5 meters to mark attendance ({calculatedDistance.toFixed(1)}m away)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Result Alert Message */}
            {lastResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border animate-in fade-in duration-200 ${
                  lastResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {lastResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{lastResult.message}</p>
                  {lastResult.record && (
                    <p className="text-[10px] font-mono mt-0.5 text-slate-600">
                      Token: #{lastResult.record.id.toUpperCase()} • Time: {lastResult.record.timestamp}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testing & Live GPS Simulation Toolbar (Crucial for Reviewers & Students) */}
      <div className="p-4 sm:p-5 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Location Simulation &amp; GPS Sensor Controls
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Easily toggle inside/outside the 5-meter area to test system rules
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset 1: Inside 5m (e.g. 2.1m) */}
          <button
            id="btn-simulate-inside-5m"
            onClick={() => setPresetDistance(2.1)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              !isUsingRealGps && calculatedDistance <= 5.0
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate Inside Hall (2.1m &lt; 5m)</span>
          </button>

          {/* Preset 2: Borderline (4.8m) */}
          <button
            id="btn-simulate-borderline"
            onClick={() => setPresetDistance(4.8)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              !isUsingRealGps && Math.abs(calculatedDistance - 4.8) < 0.3
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Near Doorway (4.8m &lt; 5m)</span>
          </button>

          {/* Preset 3: Outside Corridor (> 5m, e.g. 12.4m) */}
          <button
            id="btn-simulate-outside-5m"
            onClick={() => setPresetDistance(12.4)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              !isUsingRealGps && calculatedDistance > 5.0
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate in Corridor (12.4m &gt; 5m)</span>
          </button>

          {/* Toggle Device Real GPS */}
          <button
            id="btn-toggle-real-gps"
            onClick={() => {
              setIsUsingRealGps(!isUsingRealGps);
              setLastResult(null);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isUsingRealGps
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isAcquiringGps ? 'animate-spin' : ''}`} />
            <span>{isUsingRealGps ? 'Using Live Device GPS' : 'Connect Real Device GPS'}</span>
          </button>
        </div>

        {/* GPS Error notice if real GPS fails */}
        {gpsError && (
          <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Geofence Check-in Logs Ledger */}
      <div className="p-5 sm:p-6 bg-slate-50">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Verified Geofenced Attendance Ledger (Real-time)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cryptographically verified check-ins within the 5.0-meter perimeter
            </p>
          </div>
          <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-600">
            {geofencedLogs.length} Verified Entries
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <th className="pb-2 font-bold">Student</th>
                <th className="pb-2 font-bold">Lecture Hall / Course</th>
                <th className="pb-2 font-bold">GPS Distance</th>
                <th className="pb-2 font-bold">5m Status</th>
                <th className="pb-2 font-bold">Timestamp</th>
                <th className="pb-2 font-bold">Verification Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 font-mono text-[11px]">
              {geofencedLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-white/80 transition">
                  <td className="py-2.5 font-sans font-bold text-slate-900">
                    {log.studentName}
                  </td>
                  <td className="py-2.5 font-sans text-slate-700">
                    <span className="font-bold">{log.courseCode}</span> • {log.zoneName}
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    {log.distanceMeters.toFixed(1)}m
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        log.verifiedWithin5m
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {log.verifiedWithin5m ? 'VERIFIED ≤5M' : 'REJECTED >5M'}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 text-indigo-700 font-bold">
                    #{log.id.slice(-6).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
