const { kakao } = window;

export default class KakaomapAPI {
  constructor() {
    this.container = document.getElementById("maps");
    this.options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    this.map = new kakao.maps.Map(this.container, this.options);
    this.geocoder = new kakao.maps.services.Geocoder();
  }

  searchAddrFromCoords(lat, lng, callback) {
    this.geocoder.coord2RegionCode(lng, lat, callback);
  }
}
