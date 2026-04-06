"use client";

import { useEffect, useRef, useCallback } from "react";
import Map, { MapRef, NavigationControl, Marker } from "react-map-gl";
import { SearchBox } from "@mapbox/search-js-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
