import { useEffect, useRef, useMemo } from "react";
const { kakao } = window;

export default function useKakaomap() {
  const mapElementRef = useRef();
  const mapRef = useRef(null);
  const options = useMemo(
    () => ({
      center: new kakao.maps.LatLng(36.50701, 128.570667),
      level: 3,
    }),
    []
  );
  const geocoder = useMemo(() => new kakao.maps.services.Geocoder(), []);
  useEffect(() => {
    mapRef.current =
      mapElementRef.current &&
      new kakao.maps.Map(mapElementRef.current, options);
  }, [options]);

  const searchAddrFromCoords = function (lat, lng, callback) {
    geocoder.coord2RegionCode(lng, lat, callback);
  };
  return { mapElementRef, searchAddrFromCoords };
}
